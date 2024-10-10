import { type Knex } from "knex";

const TABLE_NAME = "projects";

const ColumnName = {
	API_KEY: "api_key",
	CREATED_AT: "created_at",
	DESCRIPTION: "description",
	ID: "id",
	LAST_ACTIVITY_DATE: "last_activity_date",
	NAME: "name",
	UPDATED_AT: "updated_at",
} as const;

const FieldLimit = {
	DESCRIPTION: 1000,
	NAME: 50,
} as const;

function up(knex: Knex): Promise<void> {
	return knex.schema.createTable(TABLE_NAME, (table) => {
		table.increments(ColumnName.ID).primary();
		table.string(ColumnName.NAME, FieldLimit.NAME).unique().notNullable();
		table.string(ColumnName.DESCRIPTION, FieldLimit.DESCRIPTION);
		table.dateTime(ColumnName.LAST_ACTIVITY_DATE).nullable();
		table
			.dateTime(ColumnName.CREATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
		table
			.dateTime(ColumnName.UPDATED_AT)
			.notNullable()
			.defaultTo(knex.fn.now());
	});
}

function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(TABLE_NAME);
}

export { down, up };
