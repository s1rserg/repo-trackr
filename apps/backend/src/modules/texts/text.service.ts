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
	type TextGetAllAnalyticsResponseDto,
	type TextQueryParameters,
	type TextCreateItemResponseDto,
	type Service,
	type TextGetAllResponseDto,
} from "~/libs/types/types.js";
import { type ContributorService } from "~/modules/contributors/contributors.js";
import { type GitEmailService } from "~/modules/git-emails/git-emails.js";
import { type ProjectService } from "~/modules/projects/project.service.js";

import { TextEntity } from "./text.entity.js";
import { type TextRepository } from "./text.repository.js";
import { type AnalyticsService } from "../github-analytics/analytics.js";

type Constructor = {
	textRepository: TextRepository;
	contributorService: ContributorService;
	gitEmailService: GitEmailService;
	projectService: ProjectService;
	analyticsService: AnalyticsService;
};

class TextService implements Service {
	private textRepository: TextRepository;
	private contributorService: ContributorService;
	private gitEmailService: GitEmailService;
	private projectService: ProjectService;
	private analyticsService: AnalyticsService;

	public constructor({
		textRepository,
		contributorService,
		gitEmailService,
		projectService,
		analyticsService,
	}: Constructor) {
		this.textRepository = textRepository;
		this.contributorService = contributorService;
		this.gitEmailService = gitEmailService;
		this.projectService = projectService;
		this.analyticsService = analyticsService;
	}

	public async create({
		logItem,
		projectId,
	}: TextCreateItemResponseDto): Promise<TextEntity | null> {
		const {
			creatorLogin,
			sourceType,
			sourceNumber,
			body,
			url,
			sentimentScore,
			sentimentLabel,
			reactionsPlusCount,
			reactionsMinusCount,
			createdAt,
			updatedAt,
		} = logItem;

		let creatorGitEmail = await this.gitEmailService.findByEmail(creatorLogin);

		if (!creatorGitEmail) {
			return null;
		}

		try {
			return await this.textRepository.create(
				TextEntity.initializeNew({
					creatorGitEmail: {
						contributor: creatorGitEmail.contributor,
						id: creatorGitEmail.id,
					},
					project: { id: projectId },
					sourceType,
					sourceNumber,
					body,
					url,
					sentimentScore,
					sentimentLabel,
					reactionsPlusCount,
					reactionsMinusCount,
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
	} & TextQueryParameters): Promise<TextGetAllAnalyticsResponseDto> {
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

		const textEntities = await this.textRepository.findAll({
			contributorName,
			endDate: formattedEndDate,
			permittedProjectIds,
			projectId,
			startDate: formattedStartDate,
		});

		const texts = textEntities.items.map((item) => item.toObject());

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
				textsOpened: number[];
				textsOpenedClosed: number[];
				textsAssigned: number[];
				textsAssignedClosed: number[];
			}
		> = {};

		for (const contributor of allContributors.items) {
			const uniqueKey = `${contributor.name}_${String(contributor.id)}`;
			contributorMap[uniqueKey] = {
				textsOpened: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_COUNT,
				),
				textsOpenedClosed: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_COUNT,
				),
				textsAssigned: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_COUNT,
				),
				textsAssignedClosed: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_COUNT,
				),
			};
		}

		for (const text of texts) {
			const { createdAt, closedAt, creatorGitEmail, assigneeGitEmail } = text;

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
				contributorMap[creatorKey].textsOpened[createdDateIndex]
			) {
				contributorMap[creatorKey].textsOpened[createdDateIndex]++;
			}

			if (
				closedDateIndex >= 0 &&
				contributorMap[creatorKey] &&
				contributorMap[creatorKey].textsOpenedClosed[closedDateIndex]
			) {
				contributorMap[creatorKey].textsOpenedClosed[closedDateIndex]++;
			}

			if (
				createdDateIndex >= 0 &&
				contributorMap[assigneeKey] &&
				contributorMap[assigneeKey].textsAssigned[createdDateIndex]
			) {
				contributorMap[assigneeKey].textsAssigned[createdDateIndex]++;
			}

			if (
				closedDateIndex >= 0 &&
				contributorMap[assigneeKey] &&
				contributorMap[assigneeKey].textsAssignedClosed[closedDateIndex]
			) {
				contributorMap[assigneeKey].textsAssignedClosed[closedDateIndex]++;
			}
		}

		return {
			items: Object.entries(contributorMap).map(
				([
					uniqueKey,
					{
						textsOpened,
						textsOpenedClosed,
						textsAssigned,
						textsAssignedClosed,
					},
				]) => {
					const [contributorName, contributorId] = uniqueKey.split("_");

					return {
						textsOpened,
						textsOpenedClosed,
						textsAssigned,
						textsAssignedClosed,
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

	public async findAllWithoutFilter(): Promise<TextGetAllResponseDto> {
		const texts = await this.textRepository.findAllWithoutFilter();

		return {
			items: texts.items.map((item) => item.toObject()),
		};
	}

	public update(): ReturnType<Service["update"]> {
		return Promise.resolve(null);
	}

	public async collectGithubAnalytics(): Promise<void> {
		const projects = await this.projectService.findGithubAnalyticsProjects();

		for (const project of projects) {
			const texts = await this.analyticsService.getTexts(
				project.apiKey || "",
				project.repositoryUrl || "",
				formatDate(new Date(), "yyyy-MM-dd") + "T00:00:00",
			);

			for (const record of texts) {
				const existingText = await this.textRepository.findByNumber(
					record.number,
					project.id,
				);

				const existingTextObject = existingText?.toObject();

				if (existingText) {
					await this.textRepository.updateCustom(existingTextObject?.id || 0, {
						title: record.title,
						body: record.body,
						state: record.state,
						closedAt: record.closedAt,
						reactionsTotalCount: record.reactionsTotalCount,
						subTextsTotalCount: record.subTextsTotalCount,
						commentsCount: record.commentsCount,
						updatedAt: record.updatedAt,
					});
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

export { TextService };
