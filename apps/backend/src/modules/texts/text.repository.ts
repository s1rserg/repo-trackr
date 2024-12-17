import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import {
	type TextCreateItemRequestDto,
	type TextQueryParameters,
	type Repository,
} from "~/libs/types/types.js";

import { TextEntity } from "./text.entity.js";
import { type TextModel } from "./text.model.js";

class TextRepository implements Repository {
	private textModel: typeof TextModel;

	public constructor(textModel: typeof TextModel) {
		this.textModel = textModel;
	}

	public async create(entity: TextEntity): Promise<TextEntity> {
		const {
			creatorGitEmail,
			project,
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
		} = entity.toNewObject();

		const textData = {
			creatorGitEmail: { id: creatorGitEmail.id },
			project: { id: project.id },
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
		};

		const createdText = await this.textModel
			.query()
			.insertGraph(textData, { relate: true })
			.returning("*")
			.execute();

		return TextEntity.initialize(createdText);
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
	} & TextQueryParameters): Promise<{ items: TextEntity[] }> {
		const query = this.textModel
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
			.whereBetween("texts.date", [startDate, endDate])
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

		const texts = await query.orderBy("date");

		return {
			items: texts.map((text) => TextEntity.initialize(text)),
		};
	}

	public async findAllWithoutFilter(): Promise<{ items: TextEntity[] }> {
		const texts = await this.textModel
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
			items: texts.map((text) => TextEntity.initialize(text)),
		};
	}

	public async findByUrl(
		url: string,
		projectId: number,
	): Promise<TextEntity | null> {
		const text = await this.textModel
			.query()
			.where("url", url)
			.andWhere("projectId", projectId)
			.first();

		return text ? TextEntity.initialize(text) : null;
	}

	public async updateCustom(
		id: number,
		updatedData: Partial<TextCreateItemRequestDto>,
	): Promise<TextEntity> {
		const updatedText = await this.textModel
			.query()
			.patchAndFetchById(id, updatedData);

		return TextEntity.initialize(updatedText);
	}

	public find(): ReturnType<Repository["find"]> {
		return Promise.resolve(null);
	}

	public update(): ReturnType<Repository["update"]> {
		return Promise.resolve(null);
	}
}

export { TextRepository };
