type IssueGetAllItemResponseDto = {
	number: number;
	creatorGitEmail: {
		contributor: {
			id: number;
			name: string;
		};
		id: number;
	};
	assigneeGitEmail: {
		contributor: {
			id: number;
			name: string;
		};
		id: number;
	} | null;
	project: { id: number };
	title: string;
	body: string;
	state: string;
	closedAt: string | null;
	reactionsTotalCount: number;
	subIssuesTotalCount: number;
	commentsCount: number;
	createdAt: string;
	updatedAt: string;
	id: number;
};

export { type IssueGetAllItemResponseDto };
