import { type Knex } from "knex";

const TABLE_NAME = "permissions";

const PermissionKeys = {
	MANAGE_ALL_PROJECTS: "manage_all_projects",
	MANAGE_USER_ACCESS: "manage_user_access",
	VIEW_ALL_PROJECTS: "view_all_projects",
};

function up(knex: Knex): Promise<void> {
	return knex(TABLE_NAME).insert([
		{
			key: PermissionKeys.MANAGE_USER_ACCESS,
			name: "Manage User Access",
		},
		{
			key: PermissionKeys.VIEW_ALL_PROJECTS,
			name: "View All Projects",
		},
		{
			key: PermissionKeys.MANAGE_ALL_PROJECTS,
			name: "Manage All Projects",
		},
	]);
}

function down(knex: Knex): Promise<void> {
	return knex(TABLE_NAME)
		.whereIn("key", [
			PermissionKeys.MANAGE_USER_ACCESS,
			PermissionKeys.VIEW_ALL_PROJECTS,
			PermissionKeys.MANAGE_ALL_PROJECTS,
		])
		.del();
}

export { down, up };
