type TextGetAllItemResponseDto = {
	creatorGitEmail: {
		contributor: {
			id: number;
			name: string;
		};
		id: number;
	};
	project: { id: number };
	body: string;
	sourceType: string;
	sourceNumber: number;
	sentimentScore: number;
	sentimentLabel: string;
	reactionsPlusCount: number;
	reactionsMinusCount: number;
	createdAt: string;
	updatedAt: string;
	id: number;
};

export { type TextGetAllItemResponseDto };
