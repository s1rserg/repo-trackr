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
	type IssueGetAllAnalyticsResponseDto,
	type IssueQueryParameters,
	type IssueCreateItemResponseDto,
	type Service,
	type IssueGetAllResponseDto,
} from "~/libs/types/types.js";
import { type ContributorService } from "~/modules/contributors/contributors.js";
import { type GitEmailService } from "~/modules/git-emails/git-emails.js";
import { type ProjectService } from "~/modules/projects/project.service.js";

import { IssueEntity } from "./issue.entity.js";
import { type IssueRepository } from "./issue.repository.js";
import { type AnalyticsService } from "../github-analytics/analytics.js";

type Constructor = {
	issueRepository: IssueRepository;
	contributorService: ContributorService;
	gitEmailService: GitEmailService;
	projectService: ProjectService;
	analyticsService: AnalyticsService;
};

class IssueService implements Service {
	private issueRepository: IssueRepository;
	private contributorService: ContributorService;
	private gitEmailService: GitEmailService;
	private projectService: ProjectService;
	private analyticsService: AnalyticsService;

	public constructor({
		issueRepository,
		contributorService,
		gitEmailService,
		projectService,
		analyticsService,
	}: Constructor) {
		this.issueRepository = issueRepository;
		this.contributorService = contributorService;
		this.gitEmailService = gitEmailService;
		this.projectService = projectService;
		this.analyticsService = analyticsService;
	}

	public async create({
		logItem,
		projectId,
	}: IssueCreateItemResponseDto): Promise<IssueEntity> {
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
			reactionsTotalCount,
			subIssuesTotalCount,
			commentsCount,
			createdAt,
			updatedAt,
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
			return await this.issueRepository.create(
				IssueEntity.initializeNew({
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
					reactionsTotalCount,
					subIssuesTotalCount,
					commentsCount,
					createdAt,
					updatedAt,
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
	} & IssueQueryParameters): Promise<IssueGetAllAnalyticsResponseDto> {
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

		const issueEntities = await this.issueRepository.findAll({
			contributorName,
			endDate: formattedEndDate,
			permittedProjectIds,
			projectId,
			startDate: formattedStartDate,
		});

		const issues = issueEntities.items.map((item) => item.toObject());

		const allContributors = await this.contributorService.findAll({
			contributorName,
			permittedProjectIds,
			projectId,
		});

		const dateRange = getDateRange(formattedStartDate, formattedEndDate);

		const INITIAL_ISSUES_COUNT = 0;

		const contributorMap: Record<
			string,
			{
				issuesOpened: number[];
				issuesOpenedClosed: number[];
				issuesAssigned: number[];
				issuesAssignedClosed: number[];
			}
		> = {};

		for (const contributor of allContributors.items) {
			const uniqueKey = `${contributor.name}_${String(contributor.id)}`;
			contributorMap[uniqueKey] = {
				issuesOpened: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_COUNT,
				),
				issuesOpenedClosed: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_COUNT,
				),
				issuesAssigned: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_COUNT,
				),
				issuesAssignedClosed: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_COUNT,
				),
			};
		}

		for (const issue of issues) {
			const { createdAt, closedAt, creatorGitEmail, assigneeGitEmail } = issue;

			const { id: creatorId, name: creatorName } = creatorGitEmail.contributor;

			let assigneeId,
				assigneeName = "";

			if (assigneeGitEmail) {
				assigneeId = assigneeGitEmail.contributor.id;
				assigneeName = assigneeGitEmail.contributor.name;
			}

			const createdDateFormatted = formatDate(new Date(createdAt), "MMM d");
			const closedDateFormatted = closedAt
				? formatDate(new Date(closedAt), "MMM d")
				: null;

			const createdDateIndex = dateRange.indexOf(createdDateFormatted);
			const closedDateIndex = closedDateFormatted
				? dateRange.indexOf(closedDateFormatted)
				: -1;

			const creatorKey = `${creatorName}_${String(creatorId)}`;
			const assigneeKey = `${assigneeName}_${String(assigneeId)}`;

			if (
				createdDateIndex >= 0 &&
				contributorMap[creatorKey] &&
				contributorMap[creatorKey].issuesOpened[createdDateIndex]
			) {
				contributorMap[creatorKey].issuesOpened[createdDateIndex]++;
			}

			if (
				closedDateIndex >= 0 &&
				contributorMap[creatorKey] &&
				contributorMap[creatorKey].issuesOpenedClosed[closedDateIndex]
			) {
				contributorMap[creatorKey].issuesOpenedClosed[closedDateIndex]++;
			}

			if (
				createdDateIndex >= 0 &&
				contributorMap[assigneeKey] &&
				contributorMap[assigneeKey].issuesAssigned[createdDateIndex]
			) {
				contributorMap[assigneeKey].issuesAssigned[createdDateIndex]++;
			}

			if (
				closedDateIndex >= 0 &&
				contributorMap[assigneeKey] &&
				contributorMap[assigneeKey].issuesAssignedClosed[closedDateIndex]
			) {
				contributorMap[assigneeKey].issuesAssignedClosed[closedDateIndex]++;
			}
		}

		return {
			items: Object.entries(contributorMap).map(
				([
					uniqueKey,
					{
						issuesOpened,
						issuesOpenedClosed,
						issuesAssigned,
						issuesAssignedClosed,
					},
				]) => {
					const [contributorName, contributorId] = uniqueKey.split("_");

					return {
						issuesOpened,
						issuesOpenedClosed,
						issuesAssigned,
						issuesAssignedClosed,
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

	public async findAllWithoutFilter(): Promise<IssueGetAllResponseDto> {
		const issues = await this.issueRepository.findAllWithoutFilter();

		return {
			items: issues.items.map((item) => item.toObject()),
		};
	}

	public update(): ReturnType<Service["update"]> {
		return Promise.resolve(null);
	}

	public async collectGithubAnalytics(): Promise<void> {
		const projects = await this.projectService.findGithubAnalyticsProjects();

		for (const project of projects) {
			const issues = await this.analyticsService.getIssues(
				project.apiKey || "",
				project.repositoryUrl || "",
				formatDate(new Date(), "yyyy-MM-dd") + "T00:00:00",
			);

			for (const record of issues) {
				const existingIssue = await this.issueRepository.findByNumber(
					record.number,
					project.id,
				);

				const existingIssueObject = existingIssue?.toObject();

				if (existingIssue) {
					await this.issueRepository.updateCustom(
						existingIssueObject?.id || 0,
						{
							title: record.title,
							body: record.body,
							state: record.state,
							closedAt: record.closedAt,
							reactionsTotalCount: record.reactionsTotalCount,
							subIssuesTotalCount: record.subIssuesTotalCount,
							commentsCount: record.commentsCount,
							updatedAt: record.updatedAt,
						},
					);
				} else {
					await this.create({
						logItem: record,
						projectId: project.id,
					});
				}
			}
		}
	}
}

export { IssueService };
