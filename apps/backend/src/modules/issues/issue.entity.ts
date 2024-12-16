import {
	type IssueGetAllItemResponseDto,
	type Entity,
} from "~/libs/types/types.js";
import { type GitEmailModel } from "~/modules/git-emails/git-emails.js";

import { type ProjectModel } from "../projects/project.model.js";

class IssueEntity implements Entity {
	private number!: number;
	private creatorGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	private assigneeGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	private project!: Pick<ProjectModel, "id">;
	private title!: string;
	private body!: string;
	private state!: string;
	private closedAt!: string;
	private reactionsTotalCount!: number;
	private subIssuesTotalCount!: number;
	private commentsCount!: number;
	private id: null | number;

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
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string;
		reactionsTotalCount: number;
		subIssuesTotalCount: number;
		commentsCount: number;
		id: null | number;
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
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string;
		reactionsTotalCount: number;
		subIssuesTotalCount: number;
		commentsCount: number;
		id: null | number;
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
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string;
		reactionsTotalCount: number;
		subIssuesTotalCount: number;
		commentsCount: number;
		id: null | number;
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
		});
	}

	public toNewObject(): {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string;
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
			creatorGitEmail: {
				contributor: this.creatorGitEmail.contributor,
				id: this.creatorGitEmail.id,
			},
			assigneeGitEmail: {
				contributor: this.assigneeGitEmail.contributor,
				id: this.assigneeGitEmail.id,
			},
			project: { id: this.project.id },
			title: this.title,
			body: this.body,
			state: this.state,
			closedAt: this.closedAt,
			reactionsTotalCount: this.reactionsTotalCount,
			subIssuesTotalCount: this.subIssuesTotalCount,
			commentsCount: this.commentsCount,
		};
	}
}

export { IssueEntity };
