const JobCronPattern = {
	INACTIVE_PROJECT_NOTIFICATION: "0 0 * * *",
	GITHUB_ANALYTICS: "0 0 * * *",
	TEXTS_ANALYTICS: "0 1 * * *",
	GEMINI_ANALYTICS: "0 2 * * *"
} as const;

export { JobCronPattern };
