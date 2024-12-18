import { type TableColumn } from "~/libs/types/types.js";

import { type AnalyticsRow } from "../../types/types.js";

const getAnalyticsColumns = (
	dateRange: string[],
	metrics: string[],
	emptyCellClassName?: string,
): TableColumn<AnalyticsRow>[] => {
	const columns: TableColumn<AnalyticsRow>[] = [
		{
			accessorKey: "contributorName",
			header: "Name",
			size: 220,
		},
	];

	const metricColumns: TableColumn<AnalyticsRow>[] = metrics.flatMap((metric) =>
		dateRange.map((date, index) => ({
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			accessorKey: `metrics.${metric}.${index}`,
			cell: ({ getValue }): JSX.Element => {
				const value = getValue() as string;
				const isEmpty = !Number(value);

				return (
					<span className={isEmpty ? emptyCellClassName : ""}>
						{isEmpty ? "-" : value}
					</span>
				);
			},
			header: date,
			size: 95,
		})),
	);

	return [...columns, ...metricColumns];
};

export { getAnalyticsColumns };
