type PullGetAllItemAnalyticsResponseDto = {
	contributor: {
		hiddenAt: null | string;
		id: string;
		name: string;
	};
	pullsOpened: number[];
	pullsOpenedMerged: number[];
	pullsAssigned: number[];
	pullsAssignedMerged: number[];
};

export { type PullGetAllItemAnalyticsResponseDto };
