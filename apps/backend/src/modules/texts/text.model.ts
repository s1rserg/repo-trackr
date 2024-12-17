import { type RelationMappings } from "objection";
import { AbstractWithoutOverride } from "~/libs/modules/database/abstract.model.js";
import {
	AbstractModel,
	DatabaseTableName,
} from "~/libs/modules/database/database.js";
import { GitEmailModel } from "~/modules/git-emails/git-emails.js";
import { ProjectModel } from "~/modules/projects/project.model.js";

class TextModel extends AbstractWithoutOverride {
	public creatorGitEmail!: Pick<GitEmailModel, "contributor" | "id">;
	public project!: Pick<ProjectModel, "id">;
	public sourceType!: string;
	public sourceNumber!: number;
	public body!: string;
	public url!: string;
	public sentimentScore!: number | null;
	public sentimentLabel!: string | null;
	public reactionsPlusCount!: number;
	public reactionsMinusCount!: number;

	public static override get relationMappings(): RelationMappings {
		return {
			creatorGitEmail: {
				join: {
					from: `${DatabaseTableName.TEXTS}.creatorGitEmailId`,
					to: `${DatabaseTableName.GIT_EMAILS}.id`,
				},
				modelClass: GitEmailModel,
				relation: AbstractModel.BelongsToOneRelation,
			},
			project: {
				join: {
					from: `${DatabaseTableName.TEXTS}.projectId`,
					to: `${DatabaseTableName.PROJECTS}.id`,
				},
				modelClass: ProjectModel,
				relation: AbstractModel.BelongsToOneRelation,
			},
		};
	}

	public static override get tableName(): string {
		return DatabaseTableName.TEXTS;
	}
}

export { TextModel };
