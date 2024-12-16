type ActivityLogGetAllItemAnalyticsResponseDto = {
	commitsNumber: number[];
	contributor: {
		hiddenAt: null | string;
		id: string;
		name: string;
	};
	linesAdded: number[];
	linesDeleted: number[];
};

export { type ActivityLogGetAllItemAnalyticsResponseDto };
