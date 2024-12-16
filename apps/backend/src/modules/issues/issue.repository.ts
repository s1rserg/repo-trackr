import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import {
	type IssueCreateItemRequestDto,
	type IssueQueryParameters,
	type Repository,
} from "~/libs/types/types.js";

import { IssueEntity } from "./issue.entity.js";
import { type IssueModel } from "./issue.model.js";

class IssueRepository implements Repository {
	private issueModel: typeof IssueModel;

	public constructor(issueModel: typeof IssueModel) {
		this.issueModel = issueModel;
	}

	public async create(entity: IssueEntity): Promise<IssueEntity> {
		const {
			number,
			creatorGitEmail,
			assigneeGitEmail,
			project,
			title,
			body,
			state,
			closedAt,
			reactionsTotalCount,
			subIssuesTotalCount,
			commentsCount,
		} = entity.toNewObject();

		const issueData = {
			number,
			creatorGitEmail: { id: creatorGitEmail.id }, // Only pass the id for creatorGitEmail
			assigneeGitEmail: assigneeGitEmail
				? { id: assigneeGitEmail.id }
				: { id: 1 }, // Only pass id or null for assigneeGitEmail
			project: { id: project.id }, // Only pass the id for project
			title,
			body,
			state,
			closedAt,
			reactionsTotalCount,
			subIssuesTotalCount,
			commentsCount,
		};

		const createdIssue = await this.issueModel
			.query()
			.insertGraph(issueData, { relate: true })
			.returning("*")
			.execute();

		return IssueEntity.initialize(createdIssue);
	}

	public delete(): ReturnType<Repository["delete"]> {
		return Promise.resolve(true);
	}

	public async findAll({
		contributorName,
		endDate,
		permittedProjectIds,
		projectId,
		startDate,
	}: {
		permittedProjectIds: number[] | undefined;
	} & IssueQueryParameters): Promise<{ items: IssueEntity[] }> {
		const query = this.issueModel
			.query()
			.withGraphFetched("[project]")
			.withGraphJoined("assigneeGitEmail.contributor")
			.modifyGraph("assigneeGitEmail.contributor", (builder) => {
				builder.select("id", "name", "hiddenAt");
			})
			.whereNull("assigneeGitEmail:contributor.hiddenAt")
			.withGraphJoined("creatorGitEmail.contributor")
			.modifyGraph("creatorGitEmail.contributor", (builder) => {
				builder.select("id", "name", "hiddenAt");
			})
			.whereNull("creatorGitEmail:contributor.hiddenAt")
			.whereBetween("issues.date", [startDate, endDate])
			.orderBy("date");

		if (contributorName) {
			query.whereILike(
				"creatorGitEmail:contributor.name",
				`%${contributorName}%`,
			);
			query.whereILike(
				"assigneeGitEmail:contributor.name",
				`%${contributorName}%`,
			);
		}

		const hasPermissionedProjects =
			permittedProjectIds && permittedProjectIds.length !== EMPTY_LENGTH;

		if (projectId) {
			query.where("projectId", projectId);
		} else if (hasPermissionedProjects) {
			query.whereIn("projectId", permittedProjectIds);
		}

		const issues = await query.orderBy("date");

		return {
			items: issues.map((issue) => IssueEntity.initialize(issue)),
		};
	}

	public async findAllWithoutFilter(): Promise<{ items: IssueEntity[] }> {
		const issues = await this.issueModel
			.query()
			.withGraphFetched(
				"[assigneeGitEmail.contributor, creatorGitEmail.contributor, project]",
			)
			.modifyGraph("assigneeGitEmail.contributor", (builder) => {
				builder.select("id", "name");
			})
			.modifyGraph("creatorGitEmail.contributor", (builder) => {
				builder.select("id", "name");
			})
			.execute();

		return {
			items: issues.map((issue) => IssueEntity.initialize(issue)),
		};
	}

	public async findByNumber(
		issueNumber: number,
		projectId: number,
	): Promise<IssueEntity | null> {
		const issue = await this.issueModel
			.query()
			.where("number", issueNumber)
			.andWhere("projectId", projectId)
			.first();

		return issue ? IssueEntity.initialize(issue) : null;
	}

	public async updateCustom(
		id: number,
		updatedData: Partial<IssueCreateItemRequestDto>,
	): Promise<IssueEntity> {
		const updatedIssue = await this.issueModel
			.query()
			.patchAndFetchById(id, updatedData);

		return IssueEntity.initialize(updatedIssue);
	}

	public find(): ReturnType<Repository["find"]> {
		return Promise.resolve(null);
	}

	public update(): ReturnType<Repository["update"]> {
		return Promise.resolve(null);
	}
}

export { IssueRepository };
