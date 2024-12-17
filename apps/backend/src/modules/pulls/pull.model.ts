import { type RelationMappings } from "objection";
import { AbstractWithoutOverride } from "~/libs/modules/database/abstract.model.js";
import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { GitEmailModel } from "~/modules/git-emails/git-emails.js";
import { ProjectModel } from "~/modules/projects/project.model.js";

class PullModel extends AbstractWithoutOverride {
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

	public static override get relationMappings(): RelationMappings {
		return {
			creatorGitEmail: {
				join: {
					from: `${DatabaseTableName.PULLS}.creatorGitEmailId`,
					to: `${DatabaseTableName.GIT_EMAILS}.id`,
				},
				modelClass: GitEmailModel,
				relation: AbstractModel.BelongsToOneRelation,
			},
			assigneeGitEmail: {
				join: {
					from: `${DatabaseTableName.PULLS}.assigneeGitEmailId`,
					to: `${DatabaseTableName.GIT_EMAILS}.id`,
				},
				modelClass: GitEmailModel,
				relation: AbstractModel.BelongsToOneRelation,
			},
			project: {
				join: {
					from: `${DatabaseTableName.PULLS}.projectId`,
					to: `${DatabaseTableName.PROJECTS}.id`,
				},
				modelClass: ProjectModel,
				relation: AbstractModel.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.PULLS;
	}
}

export { PullModel };
