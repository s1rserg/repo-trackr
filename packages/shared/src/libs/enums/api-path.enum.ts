const APIPath = {
	ACTIVITY_LOGS: "/activity-logs",
	AUTH: "/auth",
	AUTH_ANALYTICS: "/auth/analytics",
	CONTRIBUTORS: "/contributors",
	GROUPS: "/groups",
	NOTIFICATIONS: "/notifications",
	PERMISSIONS: "/permissions",
	PROJECT_API_KEYS: "/project-api-keys",
	PROJECT_GROUPS: "/project-groups",
	PROJECT_PERMISSIONS: "/project-permissions",
	PROJECTS: "/projects",
	USERS: "/users",
	ISSUES: "/issues",
	PULLS: "/pulls",
	TEXTS: "/texts",
} as const;

export { APIPath };
