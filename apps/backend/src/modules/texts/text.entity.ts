import { type GitEmailModel } from "~/modules/git-emails/git-emails.js";
import { type ProjectModel } from "../projects/project.model.js";
import {
	type TextGetAllItemResponseDto,
	type Entity,
} from "~/libs/types/types.js";

class TextEntity implements Entity {
	private creatorGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	private project!: Pick<ProjectModel, "id">;
	private sourceType!: string;
	private sourceNumber!: number;
	private body!: string;
	private url!: string;
	private sentimentScore!: number | null;
	private sentimentLabel!: string | null;
	private reactionsPlusCount!: number;
	private reactionsMinusCount!: number;
	private id!: number | null;
	private createdAt!: string;
	private updatedAt!: string;

	private constructor({
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
		id,
		createdAt,
		updatedAt,
	}: {
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		project: Pick<ProjectModel, "id">;
		sourceType: string;
		sourceNumber: number;
		body: string;
		url: string;
		sentimentScore: number | null;
		sentimentLabel: string | null;
		reactionsPlusCount: number;
		reactionsMinusCount: number;
		id: null | number;
		createdAt: string;
		updatedAt: string;
	}) {
		this.creatorGitEmail = creatorGitEmail;
		this.project = project;
		this.sourceType = sourceType;
		this.sourceNumber = sourceNumber;
		this.body = body;
		this.url = url;
		this.sentimentScore = sentimentScore;
		this.sentimentLabel = sentimentLabel;
		this.reactionsPlusCount = reactionsPlusCount;
		this.reactionsMinusCount = reactionsMinusCount;
		this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public static initialize({
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
		id,
		createdAt,
		updatedAt,
	}: {
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		project: Pick<ProjectModel, "id">;
		sourceType: string;
		sourceNumber: number;
		body: string;
		url: string;
		sentimentScore: number | null;
		sentimentLabel: string | null;
		reactionsPlusCount: number;
		reactionsMinusCount: number;
		id: null | number;
		createdAt: string;
		updatedAt: string;
	}): TextEntity {
		return new TextEntity({
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
			id,
			createdAt,
			updatedAt,
		});
	}

	public static initializeNew({
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
	}: {
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		project: Pick<ProjectModel, "id">;
		sourceType: string;
		sourceNumber: number;
		body: string;
		url: string;
		sentimentScore: number | null;
		sentimentLabel: string | null;
		reactionsPlusCount: number;
		reactionsMinusCount: number;
		createdAt: string;
		updatedAt: string;
	}): TextEntity {
		return new TextEntity({
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
			id: null,
			createdAt,
			updatedAt,
		});
	}

	public toNewObject(): {
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		project: Pick<ProjectModel, "id">;
		sourceType: string;
		sourceNumber: number;
		body: string;
		url: string;
		sentimentScore: number | null;
		sentimentLabel: string | null;
		reactionsPlusCount: number;
		reactionsMinusCount: number;
		createdAt: string;
		updatedAt: string;
	} {
		return {
			creatorGitEmail: this.creatorGitEmail,
			project: this.project,
			sourceType: this.sourceType,
			sourceNumber: this.sourceNumber,
			body: this.body,
			url: this.url,
			sentimentScore: this.sentimentScore,
			sentimentLabel: this.sentimentLabel,
			reactionsPlusCount: this.reactionsPlusCount,
			reactionsMinusCount: this.reactionsMinusCount,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	public toObject(): TextGetAllItemResponseDto {
		return {
			creatorGitEmail: this.creatorGitEmail,
			project: this.project,
			sourceType: this.sourceType,
			sourceNumber: this.sourceNumber,
			body: this.body,
			url: this.url,
			sentimentScore: this.sentimentScore,
			sentimentLabel: this.sentimentLabel,
			reactionsPlusCount: this.reactionsPlusCount,
			reactionsMinusCount: this.reactionsMinusCount,
			id: this.id as number,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}

export { TextEntity };
