import {
	type PullGetAllItemResponseDto,
	type Entity,
} from "~/libs/types/types.js";
import { type GitEmailModel } from "~/modules/git-emails/git-emails.js";

import { type ProjectModel } from "../projects/project.model.js";

class PullEntity implements Entity {
	private number!: number;
	private creatorGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	private assigneeGitEmail!: Pick<GitEmailModel, "contributor" | "id"> | null;
	private project!: Pick<ProjectModel, "id">;
	private title!: string;
	private body!: string;
	private state!: string;
	private closedAt!: string | null;
	private reactionsTotalCount!: number;
	private subPullsTotalCount!: number;
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
		subPullsTotalCount,
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
		subPullsTotalCount: number;
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
		this.subPullsTotalCount = subPullsTotalCount;
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
		subPullsTotalCount,
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
		subPullsTotalCount: number;
		commentsCount: number;
		id: null | number;
		createdAt: null | string;
		updatedAt: null | string;
	}): PullEntity {
		return new PullEntity({
			number,
			creatorGitEmail,
			assigneeGitEmail,
			project,
			title,
			body,
			state,
			closedAt,
			reactionsTotalCount,
			subPullsTotalCount,
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
		subPullsTotalCount,
		commentsCount,
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
		subPullsTotalCount: number;
		commentsCount: number;
	}): PullEntity {
		return new PullEntity({
			number,
			creatorGitEmail,
			assigneeGitEmail,
			project,
			title,
			body,
			state,
			closedAt,
			reactionsTotalCount,
			subPullsTotalCount,
			commentsCount,
			id: null,
			createdAt: null,
			updatedAt: null,
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
		subPullsTotalCount: number;
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
			subPullsTotalCount: this.subPullsTotalCount,
			commentsCount: this.commentsCount,
		};
	}

	public toObject(): PullGetAllItemResponseDto {
		return {
			number: this.number,
			creatorGitEmail: this.creatorGitEmail
			? {
				contributor: this.creatorGitEmail.contributor,
				id: this.creatorGitEmail.id,
			} : null,
			assigneeGitEmail: this.assigneeGitEmail
				? {
						contributor: this.assigneeGitEmail.contributor,
						id: this.assigneeGitEmail.id,
					}
				: null,
			project: this.project ? { id: this.project.id } : null,
			title: this.title,
			body: this.body,
			state: this.state,
			closedAt: this.closedAt,
			reactionsTotalCount: this.reactionsTotalCount,
			subPullsTotalCount: this.subPullsTotalCount,
			commentsCount: this.commentsCount,
			createdAt: this.createdAt as string,
			updatedAt: this.createdAt as string,
			id: this.id as number,
		};
	}
}

export { PullEntity };
