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
	createdAt: string;
	updatedAt: string;
	mergedAt: string | null;
	draft: boolean;
	commentsCount: number;
	reviewCommentsCount: number;
	additions: number;
	deletions: number;
	commits: number;
	changedFiles: number;
};

export { type PullCreateItemRequestDto };
