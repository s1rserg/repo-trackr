import { ExceptionMessage } from "~/libs/enums/enums.js";
import {
	formatDate,
	getDateRange,
	getEndOfDay,
	getStartOfDay,
} from "~/libs/helpers/helpers.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import {
	ActivityLogError,
	type PullGetAllAnalyticsResponseDto,
	type PullQueryParameters,
	type PullCreateItemResponseDto,
	type Service,
	type PullGetAllResponseDto,
} from "~/libs/types/types.js";
import { type ContributorService } from "~/modules/contributors/contributors.js";
import { type GitEmailService } from "~/modules/git-emails/git-emails.js";
import { type ProjectService } from "~/modules/projects/project.service.js";

import { PullEntity } from "./pull.entity.js";
import { type PullRepository } from "./pull.repository.js";
import { type AnalyticsService } from "../github-analytics/analytics.js";

type Constructor = {
	pullRepository: PullRepository;
	contributorService: ContributorService;
	gitEmailService: GitEmailService;
	projectService: ProjectService;
	analyticsService: AnalyticsService;
};

class PullService implements Service {
	private pullRepository: PullRepository;
	private contributorService: ContributorService;
	private gitEmailService: GitEmailService;
	private projectService: ProjectService;
	private analyticsService: AnalyticsService;

	public constructor({
		pullRepository,
		contributorService,
		gitEmailService,
		projectService,
		analyticsService,
	}: Constructor) {
		this.pullRepository = pullRepository;
		this.contributorService = contributorService;
		this.gitEmailService = gitEmailService;
		this.projectService = projectService;
		this.analyticsService = analyticsService;
	}

	public async create({
		logItem,
		projectId,
	}: PullCreateItemResponseDto): Promise<PullEntity> {
		const {
			number,
			creatorLogin,
			assigneeLogin,
			creatorName,
			assigneeName,
			title,
			body,
			state,
			closedAt,
			commentsCount,
			createdAt,
			updatedAt,
			mergedAt,
			draft,
			reviewCommentsCount,
			additions,
			deletions,
			commits,
			changedFiles,
		} = logItem;

		let creatorGitEmail = await this.gitEmailService.findByEmail(creatorLogin);

		if (!creatorGitEmail) {
			const contributor = await this.contributorService.create({
				name: creatorName,
			});

			creatorGitEmail = await this.gitEmailService.create({
				contributorId: contributor.id,
				email: creatorLogin,
			});
		}

		let assigneeGitEmail;

		if (assigneeLogin && assigneeName) {
			assigneeGitEmail = await this.gitEmailService.findByEmail(assigneeLogin);

			if (!assigneeGitEmail) {
				const contributor = await this.contributorService.create({
					name: assigneeName,
				});

				assigneeGitEmail = await this.gitEmailService.create({
					contributorId: contributor.id,
					email: assigneeLogin,
				});
			}
		}

		try {
			return await this.pullRepository.create(
				PullEntity.initializeNew({
					number,
					creatorGitEmail: {
						contributor: creatorGitEmail.contributor,
						id: creatorGitEmail.id,
					},
					assigneeGitEmail: assigneeGitEmail
						? {
								contributor: assigneeGitEmail.contributor,
								id: assigneeGitEmail.id,
							}
						: null,
					project: { id: projectId },
					title,
					body,
					state,
					closedAt,
					commentsCount,
					createdAt,
					updatedAt,
					mergedAt,
					draft,
					reviewCommentsCount,
					additions,
					deletions,
					commits,
					changedFiles,
				}),
			);
		} catch {
			throw new ActivityLogError({
				message: ExceptionMessage.ACTIVITY_LOG_CREATE_FAILED,
				status: HTTPCode.FORBIDDEN,
			});
		}
	}

	public delete(): ReturnType<Service["delete"]> {
		return Promise.resolve(true);
	}

	public find(): ReturnType<Service["find"]> {
		return Promise.resolve(null);
	}

	public async findAll({
		contributorName,
		endDate,
		hasRootPermission,
		projectId,
		startDate,
		userProjectIds,
	}: {
		hasRootPermission: boolean;
		userProjectIds: number[];
	} & PullQueryParameters): Promise<PullGetAllAnalyticsResponseDto> {
		const projectIdParsed = projectId ? Number(projectId) : undefined;

		let permittedProjectIds: number[];

		if (projectIdParsed) {
			if (!hasRootPermission && !userProjectIds.includes(projectIdParsed)) {
				throw new ActivityLogError({
					message: ExceptionMessage.NO_PERMISSION,
					status: HTTPCode.FORBIDDEN,
				});
			}

			permittedProjectIds = [projectIdParsed];
		} else if (hasRootPermission) {
			permittedProjectIds = [];
		} else {
			permittedProjectIds = userProjectIds;
		}

		const formattedStartDate = formatDate(
			getStartOfDay(new Date(startDate)),
			"yyyy-MM-dd",
		);

		const formattedEndDate = formatDate(
			getEndOfDay(new Date(endDate)),
			"yyyy-MM-dd",
		);

		const pullEntities = await this.pullRepository.findAll({
			contributorName,
			endDate: formattedEndDate,
			permittedProjectIds,
			projectId,
			startDate: formattedStartDate,
		});

		const pulls = pullEntities.items.map((item) => item.toObject());

		const allContributors = await this.contributorService.findAll({
			contributorName,
			permittedProjectIds,
			projectId,
		});

		const dateRange = getDateRange(formattedStartDate, formattedEndDate);

		const INITIAL_PULLS_COUNT = 0;

		const contributorMap: Record<
			string,
			{
				pullsOpened: number[];
				pullsOpenedMerged: number[];
				pullsAssigned: number[];
				pullsAssignedMerged: number[];
			}
		> = {};

		for (const contributor of allContributors.items) {
			const uniqueKey = `${contributor.name}_${String(contributor.id)}`;
			contributorMap[uniqueKey] = {
				pullsOpened: Array.from(
					{ length: dateRange.length },
					() => INITIAL_PULLS_COUNT,
				),
				pullsOpenedMerged: Array.from(
					{ length: dateRange.length },
					() => INITIAL_PULLS_COUNT,
				),
				pullsAssigned: Array.from(
					{ length: dateRange.length },
					() => INITIAL_PULLS_COUNT,
				),
				pullsAssignedMerged: Array.from(
					{ length: dateRange.length },
					() => INITIAL_PULLS_COUNT,
				),
			};
		}

		for (const pull of pulls) {
			const { createdAt, mergedAt, creatorGitEmail, assigneeGitEmail } = pull;

			const { id: creatorId, name: creatorName } = creatorGitEmail.contributor;

			let assigneeId,
				assigneeName = "";

			if (assigneeGitEmail) {
				assigneeId = assigneeGitEmail.contributor.id;
				assigneeName = assigneeGitEmail.contributor.name;
			}

			const createdDateFormatted = formatDate(new Date(createdAt), "MMM d");
			const mergedDateFormatted = mergedAt
				? formatDate(new Date(mergedAt), "MMM d")
				: null;

			const createdDateIndex = dateRange.indexOf(createdDateFormatted);
			const mergedDateIndex = mergedDateFormatted
				? dateRange.indexOf(mergedDateFormatted)
				: -1;

			const creatorKey = `${creatorName}_${String(creatorId)}`;
			const assigneeKey = `${assigneeName}_${String(assigneeId)}`;

			if (
				createdDateIndex >= 0 &&
				contributorMap[creatorKey] &&
				contributorMap[creatorKey].pullsOpened[createdDateIndex]
			) {
				contributorMap[creatorKey].pullsOpened[createdDateIndex]++;
			}

			if (
				mergedDateIndex >= 0 &&
				contributorMap[creatorKey] &&
				contributorMap[creatorKey].pullsOpenedMerged[mergedDateIndex]
			) {
				contributorMap[creatorKey].pullsOpenedMerged[mergedDateIndex]++;
			}

			if (
				createdDateIndex >= 0 &&
				contributorMap[assigneeKey] &&
				contributorMap[assigneeKey].pullsAssigned[createdDateIndex]
			) {
				contributorMap[assigneeKey].pullsAssigned[createdDateIndex]++;
			}

			if (
				mergedDateIndex >= 0 &&
				contributorMap[assigneeKey] &&
				contributorMap[assigneeKey].pullsAssignedMerged[mergedDateIndex]
			) {
				contributorMap[assigneeKey].pullsAssignedMerged[mergedDateIndex]++;
			}
		}

		return {
			items: Object.entries(contributorMap).map(
				([
					uniqueKey,
					{
						pullsOpened,
						pullsOpenedMerged,
						pullsAssigned,
						pullsAssignedMerged,
					},
				]) => {
					const [contributorName, contributorId] = uniqueKey.split("_");

					return {
						pullsOpened,
						pullsOpenedMerged,
						pullsAssigned,
						pullsAssignedMerged,
						contributor: {
							hiddenAt: null,
							id: contributorId as string,
							name: contributorName as string,
						},
					};
				},
			),
		};
	}

	public async findAllWithoutFilter(): Promise<PullGetAllResponseDto> {
		const pulls = await this.pullRepository.findAllWithoutFilter();

		return {
			items: pulls.items.map((item) => item.toObject()),
		};
	}

	public update(): ReturnType<Service["update"]> {
		return Promise.resolve(null);
	}

	public async collectGithubAnalytics(): Promise<void> {
		const projects = await this.projectService.findGithubAnalyticsProjects();

		for (const project of projects) {
			const pulls = await this.analyticsService.getPulls(
				project.apiKey || "",
				project.repositoryUrl || "",
				formatDate(new Date(), "yyyy-MM-dd") + "T00:00:00",
			);

			for (const record of pulls) {
				const existingPull = await this.pullRepository.findByNumber(
					record.number,
					project.id,
				);

				const existingPullObject = existingPull?.toObject();

				// eslint-disable-next-line unicorn/prefer-ternary
				if (existingPull) {
					// Update the existing pull
					await this.pullRepository.updateCustom(existingPullObject?.id || 0, {
						title: record.title,
						body: record.body,
						state: record.state,
						mergedAt: record.mergedAt,
						closedAt: record.closedAt,
						commentsCount: record.commentsCount,
						reviewCommentsCount: record.reviewCommentsCount,
						additions: record.additions,
						deletions: record.deletions,
						commits: record.commits,
						changedFiles: record.changedFiles,
						draft: record.draft,
						updatedAt: record.updatedAt,
					});
				} else {
					// Create a new pull
					await this.create({
						logItem: record,
						projectId: project.id,
					});
				}
			}
		}
	}
}

export { PullService };
