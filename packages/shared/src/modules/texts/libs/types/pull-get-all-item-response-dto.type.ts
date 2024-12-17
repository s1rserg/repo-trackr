type PullGetAllItemResponseDto = {
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
	mergedAt: string | null;
	draft: boolean;
	commentsCount: number;
	reviewCommentsCount: number;
	additions: number;
	deletions: number;
	commits: number;
	changedFiles: number;
	createdAt: string;
	updatedAt: string;
	id: number;
};

export { type PullGetAllItemResponseDto };
