import { type Knex } from "knex";

const TABLE_NAME = "texts";
const GIT_EMAILS_TABLE_NAME = "git_emails";
const PROJECTS_TABLE_NAME = "projects";

const ColumnName = {
	ID: "id",
	CREATOR_GIT_EMAIL_ID: "creator_git_email_id",
	PROJECT_ID: "project_id",
	SOURCE_TYPE: "source_type",
	SOURCE_NUMBER: "source_number",
	BODY: "body",
	URL: "url",
	SENTIMENT_SCORE: "sentiment_score",
	SENTIMENT_LABEL: "sentiment_label",
	REACTIONS_PLUS_COUNT: "reactions_plus_count",
	REACTIONS_MINUS_COUNT: "reactions_minus_count",
	CREATED_AT: "created_at",
	UPDATED_AT: "updated_at",
} as const;

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table
			.integer(ColumnName.CREATOR_GIT_EMAIL_ID)
			.unsigned()
			.notNullable()
			.references("id")
			.inTable(GIT_EMAILS_TABLE_NAME)
			.onDelete("CASCADE");
		table
			.integer(ColumnName.PROJECT_ID)
			.unsigned()
			.notNullable()
			.references("id")
			.inTable(PROJECTS_TABLE_NAME)
			.onDelete("CASCADE");
		table.string(ColumnName.SOURCE_TYPE).notNullable();
		table.integer(ColumnName.SOURCE_NUMBER).unsigned().notNullable();
		table.text(ColumnName.BODY).nullable();
		table.string(ColumnName.URL).notNullable();
		table.float(ColumnName.SENTIMENT_SCORE).nullable();
		table.string(ColumnName.SENTIMENT_LABEL).nullable();
		table
			.integer(ColumnName.REACTIONS_PLUS_COUNT)
			.unsigned()
			.notNullable()
			.defaultTo(0);
		table
			.integer(ColumnName.REACTIONS_MINUS_COUNT)
			.unsigned()
			.notNullable()
			.defaultTo(0);
		table.dateTime(ColumnName.CREATED_AT).nullable().defaultTo(knex.fn.now());
		table.dateTime(ColumnName.UPDATED_AT).nullable().defaultTo(knex.fn.now());
	});
}

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TABLE_NAME);
}

export { up, down };
