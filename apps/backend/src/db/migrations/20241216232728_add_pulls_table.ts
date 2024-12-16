import { type Knex } from "knex";

const TABLE_NAME = "pulls";
const GIT_EMAILS_TABLE_NAME = "git_emails";
const PROJECTS_TABLE_NAME = "projects";

const ColumnName = {
	ID: "id",
	NUMBER: "number",
	CREATOR_GIT_EMAIL_ID: "creator_git_email_id",
	ASSIGNEE_GIT_EMAIL_ID: "assignee_git_email_id",
	PROJECT_ID: "project_id",
	TITLE: "title",
	BODY: "body",
	STATE: "state",
	CLOSED_AT: "closed_at",
	MERGED_AT: "merged_at",
	DRAFT: "draft",
	COMMENTS_COUNT: "comments_count",
	REVIEW_COMMENTS_COUNT: "review_comments_count",
	ADDITIONS: "additions",
	DELETIONS: "deletions",
	COMMITS: "commits",
	CHANGED_FILES: "changed_files",
	CREATED_AT: "created_at",
	UPDATED_AT: "updated_at",
} as const;

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table.integer(ColumnName.NUMBER).unsigned().notNullable();
		table
			.integer(ColumnName.CREATOR_GIT_EMAIL_ID)
			.unsigned()
			.notNullable()
			.references("id")
			.inTable(GIT_EMAILS_TABLE_NAME)
			.onDelete("CASCADE");
		table
			.integer(ColumnName.ASSIGNEE_GIT_EMAIL_ID)
			.unsigned()
			.nullable()
			.references("id")
			.inTable(GIT_EMAILS_TABLE_NAME)
			.onDelete("SET NULL");
		table
			.integer(ColumnName.PROJECT_ID)
			.unsigned()
			.notNullable()
			.references("id")
			.inTable(PROJECTS_TABLE_NAME)
			.onDelete("CASCADE");
		table.string(ColumnName.TITLE).notNullable();
		table.text(ColumnName.BODY).notNullable();
		table.string(ColumnName.STATE).notNullable();
		table.dateTime(ColumnName.CLOSED_AT).nullable();
		table.dateTime(ColumnName.MERGED_AT).nullable();
		table.boolean(ColumnName.DRAFT).notNullable().defaultTo(false);
		table.integer(ColumnName.COMMENTS_COUNT).unsigned().notNullable().defaultTo(0);
		table
			.integer(ColumnName.REVIEW_COMMENTS_COUNT)
			.unsigned()
			.notNullable()
			.defaultTo(0);
		table.integer(ColumnName.ADDITIONS).unsigned().notNullable().defaultTo(0);
		table.integer(ColumnName.DELETIONS).unsigned().notNullable().defaultTo(0);
		table.integer(ColumnName.COMMITS).unsigned().notNullable().defaultTo(0);
		table.integer(ColumnName.CHANGED_FILES).unsigned().notNullable().defaultTo(0);
		table
			.dateTime(ColumnName.CREATED_AT)
			.nullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.nullable()
			.defaultTo(knex.fn.now());
	});
}

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TABLE_NAME);
}

export { up, down };
