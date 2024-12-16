type IssueCreateItemResponseDto = {
	logItem: {
		number: number;
		creatorLogin: string;
		assigneeLogin: string;
		creatorName: string;
		assigneeName: string
		title: string;
		body: string;
		state: string;
		closedAt: string;
		reactionsTotalCount: number;
		subIssuesTotalCount: number;
		commentsCount: number;
	};
	projectId: number;
};

export { type IssueCreateItemResponseDto };
