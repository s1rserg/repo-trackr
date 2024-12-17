type TextCreateItemRequestDto = {
	creatorLogin: string;
	creatorName: string;
	sourceType: string;
	sourceNumber: number;
	body: string;
	url: string;
	sentimentScore: number;
	sentimentLabel: string;
	createdAt: string;
	updatedAt: string;
	reactionsPlusCount: number;
	reactionsMinusCount: number;
};

export { type TextCreateItemRequestDto };
