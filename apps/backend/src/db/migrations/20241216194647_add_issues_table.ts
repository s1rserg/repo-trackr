import { type Knex } from "knex";

const TABLE_NAME = "issues";
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
  REACTIONS_TOTAL_COUNT: "reactions_total_count",
  SUB_ISSUES_TOTAL_COUNT: "sub_issues_total_count",
  COMMENTS_COUNT: "comments_count",
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
    table.integer(ColumnName.REACTIONS_TOTAL_COUNT).unsigned().notNullable();
    table.integer(ColumnName.SUB_ISSUES_TOTAL_COUNT).unsigned().notNullable();
    table.integer(ColumnName.COMMENTS_COUNT).unsigned().notNullable();
    table.dateTime(ColumnName.CREATED_AT).nullable().defaultTo(knex.fn.now());
    table.dateTime(ColumnName.UPDATED_AT).nullable().defaultTo(knex.fn.now());
  });
}

function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(TABLE_NAME);
}

export { up, down };
