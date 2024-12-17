import {
	type IssueGetAllItemResponseDto,
	type Entity,
} from "~/libs/types/types.js";
import { type GitEmailModel } from "~/modules/git-emails/git-emails.js";

import { type ProjectModel } from "../projects/project.model.js";

class IssueEntity implements Entity {
	private number!: number;
	private creatorGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	private assigneeGitEmail!: Pick<GitEmailModel, "contributor" | "id"> | null;
	private project!: Pick<ProjectModel, "id">;
	private title!: string;
	private body!: string;
	private state!: string;
	private closedAt!: string | null;
	private reactionsTotalCount!: number;
	private subIssuesTotalCount!: number;
	private commentsCount!: number;
	private id: null | number;
	private createdAt: null | string;
	private updatedAt: null | string;

	private constructor({
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
		id,
		createdAt,
		updatedAt,
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id"> | null;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string | null;
		reactionsTotalCount: number;
		subIssuesTotalCount: number;
		commentsCount: number;
		id: null | number;
		createdAt: null | string;
		updatedAt: null | string;
	}) {
		this.number = number;
		this.creatorGitEmail = creatorGitEmail;
		this.assigneeGitEmail = assigneeGitEmail;
		this.project = project;
		this.title = title;
		this.body = body;
		this.state = state;
		this.closedAt = closedAt;
		this.reactionsTotalCount = reactionsTotalCount;
		this.subIssuesTotalCount = subIssuesTotalCount;
		this.commentsCount = commentsCount;
		this.id = id;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public static initialize({
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
		id,
		createdAt,
		updatedAt,
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id"> | null;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string | null;
		reactionsTotalCount: number;
		subIssuesTotalCount: number;
		commentsCount: number;
		id: null | number;
		createdAt: null | string;
		updatedAt: null | string;
	}): IssueEntity {
		return new IssueEntity({
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
			id,
			createdAt,
			updatedAt,
		});
	}

	public static initializeNew({
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
		createdAt,
		updatedAt,
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id"> | null;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string | null;
		reactionsTotalCount: number;
		subIssuesTotalCount: number;
		commentsCount: number;
		createdAt: null | string;
		updatedAt: null | string;
	}): IssueEntity {
		return new IssueEntity({
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
			id: null,
			createdAt,
			updatedAt,
		});
	}

	public toNewObject(): {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id"> | null;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string | null;
		reactionsTotalCount: number;
		subIssuesTotalCount: number;
		commentsCount: number;
	} {
		return {
			number: this.number,
			creatorGitEmail: this.creatorGitEmail,
			assigneeGitEmail: this.assigneeGitEmail,
			project: this.project,
			title: this.title,
			body: this.body,
			state: this.state,
			closedAt: this.closedAt,
			reactionsTotalCount: this.reactionsTotalCount,
			subIssuesTotalCount: this.subIssuesTotalCount,
			commentsCount: this.commentsCount,
		};
	}

	public toObject(): IssueGetAllItemResponseDto {
		return {
			number: this.number,
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			creatorGitEmail: this.creatorGitEmail
				? {
						contributor: this.creatorGitEmail.contributor,
						id: this.creatorGitEmail.id,
					}
				: null,
			assigneeGitEmail: this.assigneeGitEmail
				? {
						contributor: this.assigneeGitEmail.contributor,
						id: this.assigneeGitEmail.id,
					}
				: null,
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			project: this.project ? { id: this.project.id } : null,
			title: this.title,
			body: this.body,
			state: this.state,
			closedAt: this.closedAt,
			reactionsTotalCount: this.reactionsTotalCount,
			subIssuesTotalCount: this.subIssuesTotalCount,
			commentsCount: this.commentsCount,
			createdAt: this.createdAt as string,
			updatedAt: this.updatedAt as string,
			id: this.id as number,
		};
	}
}

export { IssueEntity };
