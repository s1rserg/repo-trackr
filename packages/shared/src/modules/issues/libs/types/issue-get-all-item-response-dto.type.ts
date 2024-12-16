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
	};
	project: { id: number };
	title: string;
	body: string;
	state: string;
	closedAt: string;
	reactionsTotalCount: number;
	subIssuesTotalCount: number;
	commentsCount: number;
  };
  
  export { type IssueGetAllItemResponseDto };
