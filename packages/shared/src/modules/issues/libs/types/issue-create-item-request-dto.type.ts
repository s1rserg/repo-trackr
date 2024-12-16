type IssueCreateItemRequestDto = {
	number: number;
	creatorLogin: string;
	assigneeLogin: string | null;
	creatorName: string;
	assigneeName: string | null;
	title: string;
	body: string;
	state: string;
	closedAt: string | null;
	reactionsTotalCount: number;
	subIssuesTotalCount: number;
	commentsCount: number;
	createdAt: string;
	updatedAt: string;
};

export { type IssueCreateItemRequestDto };
