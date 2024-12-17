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
	private mergedAt!: string | null;
	private draft!: boolean;
	private commentsCount!: number;
	private reviewCommentsCount!: number;
	private additions!: number;
	private deletions!: number;
	private commits!: number;
	private changedFiles!: number;
	private createdAt: string;
	private updatedAt: string;
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
		id,
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id"> | null;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string | null;
		mergedAt: string | null;
		draft: boolean;
		commentsCount: number;
		reviewCommentsCount: number;
		additions: number;
		deletions: number;
		commits: number;
		changedFiles: number;
		createdAt: string;
		updatedAt: string;
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
		this.mergedAt = mergedAt;
		this.draft = draft;
		this.commentsCount = commentsCount;
		this.reviewCommentsCount = reviewCommentsCount;
		this.additions = additions;
		this.deletions = deletions;
		this.commits = commits;
		this.changedFiles = changedFiles;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
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
		id,
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id"> | null;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string | null;
		mergedAt: string | null;
		draft: boolean;
		commentsCount: number;
		reviewCommentsCount: number;
		additions: number;
		deletions: number;
		commits: number;
		changedFiles: number;
		createdAt: string;
		updatedAt: string;
		id: null | number;
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
	}: {
		number: number;
		creatorGitEmail: Pick<GitEmailModel, "contributor" | "id">;
		assigneeGitEmail: Pick<GitEmailModel, "contributor" | "id"> | null;
		project: Pick<ProjectModel, "id">;
		title: string;
		body: string;
		state: string;
		closedAt: string | null;
		mergedAt: string | null;
		draft: boolean;
		commentsCount: number;
		reviewCommentsCount: number;
		additions: number;
		deletions: number;
		commits: number;
		changedFiles: number;
		createdAt: string;
		updatedAt: string;
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
			id: null,
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
		mergedAt: string | null;
		draft: boolean;
		commentsCount: number;
		reviewCommentsCount: number;
		additions: number;
		deletions: number;
		commits: number;
		changedFiles: number;
		createdAt: string;
		updatedAt: string;
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
			mergedAt: this.mergedAt,
			draft: this.draft,
			commentsCount: this.commentsCount,
			reviewCommentsCount: this.reviewCommentsCount,
			additions: this.additions,
			deletions: this.deletions,
			commits: this.commits,
			changedFiles: this.changedFiles,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	public toObject(): PullGetAllItemResponseDto {
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
			mergedAt: this.mergedAt,
			draft: this.draft,
			commentsCount: this.commentsCount,
			reviewCommentsCount: this.reviewCommentsCount,
			additions: this.additions,
			deletions: this.deletions,
			commits: this.commits,
			changedFiles: this.changedFiles,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			id: this.id as number,
		};
	}
}

export { PullEntity };
