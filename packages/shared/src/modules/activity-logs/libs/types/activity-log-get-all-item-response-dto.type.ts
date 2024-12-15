type ActivityLogGetAllItemResponseDto = {
	commitsNumber: number;
	createdByUser: { id: number };
	date: string;
	gitEmail: {
		contributor: {
			id: number;
			name: string;
		};
		id: number;
	};
	linesAdded: number;
	linesDeleted: number;
	id: number;
	project: { id: number };
};

export { type ActivityLogGetAllItemResponseDto };
