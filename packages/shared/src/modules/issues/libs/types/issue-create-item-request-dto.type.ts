type ActivityLogCreateItemRequestDto = {
	date: string;
	items: {
		authorEmail: string;
		authorName: string;
		commitsNumber: number;
		linesAdded: number;
		linesDeleted: number;
	}[];
};

export { type ActivityLogCreateItemRequestDto };
