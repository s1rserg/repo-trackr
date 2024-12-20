type TextGetAllItemAnalyticsResponseDto = {
	contributor: {
		hiddenAt: null | string;
		id: string;
		name: string;
	};
	comments: number[];
	pullReviews: number[];
	averageSentimentScore: number | null;
	topSentimentLabels: string[];
};

export { type TextGetAllItemAnalyticsResponseDto };
