type TextCreateItemRequestDto = {
	creatorLogin: string;
	sourceType: string;
	sourceNumber: number;
	body: string;
	url: string;
	sentimentScore: number | null;
	sentimentLabel: string | null;
	createdAt: string;
	updatedAt: string;
	reactionsPlusCount: number;
	reactionsMinusCount: number;
};

export { type TextCreateItemRequestDto };
