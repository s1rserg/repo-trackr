import { type Knex } from "knex";

const TABLE_NAME = "projects";

const ColumnName = {
	API_KEY: "api_key",
	REPOSITORY_URL: "repository_url",
} as const;

const FieldLimit = {
	API_KEY: 255,
	REPOSITORY_URL: 255,
} as const;

function up(knex: Knex): Promise<void> {
	return knex.schema.table(TABLE_NAME, (table) => {
		table.string(ColumnName.API_KEY, FieldLimit.API_KEY).nullable();
		table
			.string(ColumnName.REPOSITORY_URL, FieldLimit.REPOSITORY_URL)
			.nullable();
	});
}

function down(knex: Knex): Promise<void> {
	return knex.schema.table(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.API_KEY);
		table.dropColumn(ColumnName.REPOSITORY_URL);
	});
}

export { down, up };
