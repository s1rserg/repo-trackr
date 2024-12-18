export { ANALYTICS_DATE_MAX_RANGE } from "./analytics-date-max-range.constant.js";
export { ANALYTICS_DEFAULT_DATE_RANGE } from "./analytics-default-date-range.constant.js";
export { ANALYTICS_LOOKBACK_DAYS_COUNT } from "./analytics-lookback-days-count.constant.js";
export const metricOptions = {
	commits: { key: "commits", label: "Commits" },
	linesAdded: { key: "linesAdded", label: "Lines Added" },
	linesDeleted: { key: "linesDeleted", label: "Lines Deleted" },
	issuesOpened: { key: "issuesOpened", label: "Issues Opened" },
	issuesAssigned: { key: "issuesAssigned", label: "Issues Assigned" },
	issuesAssignedClosed: {
		key: "issuesAssignedClosed",
		label: "Issues Assigned Closed",
	},
	pullsOpened: { key: "pullsOpened", label: "Pull Requests Opened" },
	pullsOpenedMerged: {
		key: "pullsOpenedMerged",
		label: "Pull Requests Opened Merged",
	},
	pullsAssigned: { key: "pullsAssigned", label: "Pull Requests Assigned" },
	pullsAssignedMerged: {
		key: "pullsAssignedMerged",
		label: "Pull Requests Assigned Merged",
	},
	comments: { key: "comments", label: "Comments" },
	pullReviews: { key: "pullReviews", label: "Pull Request Reviews" },
};
