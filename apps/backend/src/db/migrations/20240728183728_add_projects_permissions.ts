import { type Knex } from "knex";

const TABLE_NAME = "project_permissions";

const PermissionKeys = {
	MANAGE_PROJECT: "manage_project",
	VIEW_PROJECT: "view_project",
} as const;

function up(knex: Knex): Promise<void> {
	return knex(TABLE_NAME).insert([
		{
			key: PermissionKeys.VIEW_PROJECT,
			name: "View Project",
		},
		{
			key: PermissionKeys.MANAGE_PROJECT,
			name: "Manage Project",
		},
	]);
}

function down(knex: Knex): Promise<void> {
	return knex(TABLE_NAME)
		.whereIn("key", [
			PermissionKeys.VIEW_PROJECT,
			PermissionKeys.MANAGE_PROJECT,
		])
		.del();
}

export { down, up };
