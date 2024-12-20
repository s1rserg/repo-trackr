const JobCronPattern = {
	INACTIVE_PROJECT_NOTIFICATION: "0 0 * * *",
	COMMIT_ANALYTICS: "0 0 * * *",
	ISSUES_ANALYTICS: "0 1 * * *",
	PULLS_ANALYTICS: "0 2 * * *",
	TEXTS_ANALYTICS: "0 3 * * *",
	GEMINI_ANALYTICS: "0 4 * * *",
} as const;

export { JobCronPattern };
