import { type RelationMappings } from "objection";
import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { GitEmailModel } from "~/modules/git-emails/git-emails.js";
import { ProjectModel } from "~/modules/projects/project.model.js";

class IssueModel extends AbstractModel {
	public number!: number;
	public creatorGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	public assigneeGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	public project!: Pick<ProjectModel, "id">;
	public title!: string;
	public body!: string;
	public state!: string;
	public closedAt!: string;
	public reactionsTotalCount!: number;
	public subIssuesTotalCount!: number;
	public commentsCount!: number;

	public static override get relationMappings(): RelationMappings {
		return {
			creatorGitEmail: {
				join: {
					from: `${DatabaseTableName.ACTIVITY_LOGS}.creatorGitEmailId`,
					to: `${DatabaseTableName.GIT_EMAILS}.id`,
				},
				modelClass: GitEmailModel,
				relation: AbstractModel.BelongsToOneRelation,
			},
			assigneeGitEmail: {
				join: {
					from: `${DatabaseTableName.ACTIVITY_LOGS}.assigneeGitEmailId`,
					to: `${DatabaseTableName.GIT_EMAILS}.id`,
				},
				modelClass: GitEmailModel,
				relation: AbstractModel.BelongsToOneRelation,
			},
			project: {
				join: {
					from: `${DatabaseTableName.ACTIVITY_LOGS}.projectId`,
					to: `${DatabaseTableName.PROJECTS}.id`,
				},
				modelClass: ProjectModel,
				relation: AbstractModel.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.ACTIVITY_LOGS;
	}
}

export { IssueModel };
