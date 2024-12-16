type PullCreateItemRequestDto = {
	number: number;
	creatorLogin: string;
	assigneeLogin: string | null;
	creatorName: string;
	assigneeName: string | null;
	title: string;
	body: string;
	state: string;
	closedAt: string | null;
	commentsCount: number;
	createdAt: string;
	updatedAt: string;
	mergedAt: string | null;
	draft: boolean;
	reviewCommentsCount: number;
	additions: number;
	deletions: number;
	commits: number;
	changedFiles: number;
};

export { type PullCreateItemRequestDto };
