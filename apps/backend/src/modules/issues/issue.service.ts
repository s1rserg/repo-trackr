import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
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

		let assigneeGitEmail =
			await this.gitEmailService.findByEmail(assigneeLogin);

		if (!assigneeGitEmail) {
			const contributor = await this.contributorService.create({
				name: assigneeName,
			});

			assigneeGitEmail = await this.gitEmailService.create({
				contributorId: contributor.id,
				email: assigneeLogin,
			});
		}

		try {
			return await this.issueRepository.create(
				IssueEntity.initializeNew({
					number,
					creatorGitEmail: {
						contributor: creatorGitEmail.contributor,
						id: creatorGitEmail.id,
					},
					assigneeGitEmail: {
						contributor: assigneeGitEmail.contributor,
						id: assigneeGitEmail.id,
					},
					project: { id: projectId },
					title,
					body,
					state,
					closedAt,
					reactionsTotalCount,
					subIssuesTotalCount,
					commentsCount,
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

		const INITIAL_ISSUES_NUMBER = 0;

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
					() => INITIAL_ISSUES_NUMBER,
				),
				issuesOpenedClosed: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_NUMBER,
				),
				issuesAssigned: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_NUMBER,
				),
				issuesAssignedClosed: Array.from(
					{ length: dateRange.length },
					() => INITIAL_ISSUES_NUMBER,
				),
			};
		}

		for (const issue of issues) {
			const { state, createdAt, closedAt, creatorGitEmail, assigneeGitEmail } =
				issue;
			const { id: creatorId, name: creatorName } = creatorGitEmail.contributor;
			const { id: assigneeId, name: assigneeName } =
				assigneeGitEmail.contributor;

			const issueCreatedDate = formatDate(
				getStartOfDay(new Date(createdAt)),
				"yyyy-MM-dd",
			);
			const issueClosedDate = closedAt ? formatDate(
				getStartOfDay(new Date(closedAt)),
				"yyyy-MM-dd",
			) : null;

			const creatorKey = `${creatorName}_${String(creatorId)}`;
			const assigneeKey = `${assigneeName}_${String(assigneeId)}`;

			if (
				issueCreatedDate >= formattedStartDate &&
				issueCreatedDate <= formattedEndDate &&
				contributorMap[creatorKey]
			) {
				contributorMap[creatorKey].issuesOpened++;

				if (
					state === "closed" &&
					issueClosedDate &&
					issueClosedDate <= formattedEndDate
				) {
					contributorMap[creatorKey].issuesOpenedClosed++;
				}
			}

			if (contributorMap[uniqueKey]) {
				// Update commits number
				const currentCommits =
					contributorMap[uniqueKey].commitsNumber[dateIndex] ??
					INITIAL_COMMITS_NUMBER;
				contributorMap[uniqueKey].commitsNumber[dateIndex] =
					currentCommits + commitsNumber;

				// Update lines added
				const currentLinesAdded =
					contributorMap[uniqueKey].linesAdded[dateIndex] ??
					INITIAL_LINES_NUMBER;
				contributorMap[uniqueKey].linesAdded[dateIndex] =
					currentLinesAdded + linesAdded;

				// Update lines deleted
				const currentLinesDeleted =
					contributorMap[uniqueKey].linesDeleted[dateIndex] ??
					INITIAL_LINES_NUMBER;
				contributorMap[uniqueKey].linesDeleted[dateIndex] =
					currentLinesDeleted + linesDeleted;
			}
		}

		return {
			items: Object.entries(contributorMap).map(
				([uniqueKey, { commitsNumber, linesAdded, linesDeleted }]) => {
					const [contributorName, contributorId] = uniqueKey.split("_");

					return {
						commitsNumber,
						linesAdded,
						linesDeleted,
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
			const issues = await this.analyticsService.groupCommitsByAuthor(
				project.apiKey || "",
				project.repositoryUrl || "",
				formatDate(new Date(), "yyyy-MM-dd") + "T00:00:00",
			);

			const createdIssues: IssueGetAllResponseDto = {
				items: [],
			};

			for (const record of issues.items) {
				const issue = await this.createIssue({
					date: issues.date,
					logItem: record,
					projectId: project.id,
					userId: 1,
				});

				createdIssues.items.push(issue.toObject());

				if (issues.items.length > EMPTY_LENGTH) {
					await this.projectService.updateLastActivityDate(
						project.id,
						issues.date,
					);
				}
			}
		}
	}
}

export { IssueService };
