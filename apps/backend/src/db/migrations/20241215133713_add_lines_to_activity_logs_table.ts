import { type Knex } from "knex";

const TABLE_NAME = "activity_logs";

const ColumnName = {
	LINES_ADDED: "lines_added",
	LINES_DELETED: "lines_deleted",
} as const;

const MIN_LINES = 0;

function up(knex: Knex): Promise<void> {
	return knex.schema.table(TABLE_NAME, (table) => {
		table.integer(ColumnName.LINES_ADDED).unsigned().defaultTo(MIN_LINES);
		table.integer(ColumnName.LINES_DELETED).unsigned().defaultTo(MIN_LINES);
	});
}

function down(knex: Knex): Promise<void> {
	return knex.schema.table(TABLE_NAME, (table) => {
		table.dropColumn(ColumnName.LINES_ADDED);
		table.dropColumn(ColumnName.LINES_DELETED);
	});
}

export { down, up };
