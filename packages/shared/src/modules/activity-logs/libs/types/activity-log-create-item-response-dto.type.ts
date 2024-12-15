type ActivityLogCreateItemResponseDto = {
	date: string;
	logItem: {
		authorEmail: string;
		authorName: string;
		commitsNumber: number;
		linesAdded: number;
		linesDeleted: number;
	};
	projectId: number;
	userId: number;
};

export { type ActivityLogCreateItemResponseDto };
