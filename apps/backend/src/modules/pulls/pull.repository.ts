import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import {
	type PullCreateItemRequestDto,
	type PullQueryParameters,
	type Repository,
} from "~/libs/types/types.js";

import { PullEntity } from "./pull.entity.js";
import { type PullModel } from "./pull.model.js";

class PullRepository implements Repository {
	private pullModel: typeof PullModel;

	public constructor(pullModel: typeof PullModel) {
		this.pullModel = pullModel;
	}

	public async create(entity: PullEntity): Promise<PullEntity> {
		const {
			number,
			creatorGitEmail,
			assigneeGitEmail,
			project,
			title,
			body,
			state,
			closedAt,
			mergedAt,
			draft,
			commentsCount,
			reviewCommentsCount,
			additions,
			deletions,
			commits,
			changedFiles,
			createdAt,
			updatedAt,
		} = entity.toNewObject();

		const pullData = {
			number,
			creatorGitEmail: { id: creatorGitEmail.id },
			assigneeGitEmail: assigneeGitEmail
				? { id: assigneeGitEmail.id }
				: { id: 0 },
			project: { id: project.id },
			title,
			body,
			state,
			closedAt,
			mergedAt,
			draft,
			commentsCount,
			reviewCommentsCount,
			additions,
			deletions,
			commits,
			changedFiles,
			createdAt,
			updatedAt,
		};

		const createdPull = await this.pullModel
			.query()
			.insertGraph(pullData, { relate: true })
			.returning("*")
			.execute();

		return PullEntity.initialize(createdPull);
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
	} & PullQueryParameters): Promise<{ items: PullEntity[] }> {
		const query = this.pullModel
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
			.whereBetween("pulls.updatedAt", [startDate, endDate])
			.orderBy("updatedAt");

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

		const pulls = await query.orderBy("updatedAt");

		return {
			items: pulls.map((pull) => PullEntity.initialize(pull)),
		};
	}

	public async findAllWithoutFilter(): Promise<{ items: PullEntity[] }> {
		const pulls = await this.pullModel
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
			items: pulls.map((pull) => PullEntity.initialize(pull)),
		};
	}

	public async findByNumber(
		pullNumber: number,
		projectId: number,
	): Promise<PullEntity | null> {
		const pull = await this.pullModel
			.query()
			.where("number", pullNumber)
			.andWhere("projectId", projectId)
			.first();

		return pull ? PullEntity.initialize(pull) : null;
	}

	public async updateCustom(
		id: number,
		updatedData: Partial<PullCreateItemRequestDto>,
	): Promise<PullEntity> {
		const updatedPull = await this.pullModel
			.query()
			.patchAndFetchById(id, updatedData);

		return PullEntity.initialize(updatedPull);
	}

	public find(): ReturnType<Repository["find"]> {
		return Promise.resolve(null);
	}

	public update(): ReturnType<Repository["update"]> {
		return Promise.resolve(null);
	}
}

export { PullRepository };
