import {
	type PullGetAllItemResponseDto,
	type Entity,
} from "~/libs/types/types.js";
import { type GitEmailModel } from "~/modules/git-emails/git-emails.js";

import { type ProjectModel } from "../projects/project.model.js";

class PullEntity implements Entity {
	public number!: number;
	public creatorGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	public assigneeGitEmail!: Pick<GitEmailModel, "contributor" | "id"> | null;
	public project!: Pick<ProjectModel, "id">;
	public title!: string;
	public body!: string;
	public state!: string;
	public closedAt!: string | null;
	public mergedAt!: string | null;
	public draft!: boolean;
	public commentsCount!: number;
	public reviewCommentsCount!: number;
	public additions!: number;
	public deletions!: number;
	public commits!: number;
	public changedFiles!: number;
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
		mergedAt: string | null;
		draft: boolean;
		commentsCount: number;
		reviewCommentsCount: number;
		additions: number;
		deletions: number;
		commits: number;
		changedFiles: number;
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
			project: { id: this.project.id },
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
			createdAt: this.createdAt as string,
			updatedAt: this.updatedAt as string,
		};
	}
}

export { PullEntity };
