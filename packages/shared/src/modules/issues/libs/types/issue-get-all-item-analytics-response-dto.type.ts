type IssueGetAllItemAnalyticsResponseDto = {
	contributor: {
		hiddenAt: null | string;
		id: string;
		name: string;
	};
	issuesOpened: number[];
	issuesOpenedClosed: number[];
	issuesAssigned: number[];
	issuesAssignedClosed: number[];
};

export { type IssueGetAllItemAnalyticsResponseDto };
