type AggregatedAnalytics = {
	[metric: string]: number[];
};

export { checkIsProjectPermitted } from "./check-is-project-permitted.js";

export function aggregateAnalytics<
	T extends { contributor: { id: string }; [metric: string]: number[] },
>(items: T[], metrics: (keyof T)[]): AggregatedAnalytics {
	const aggregatedData: AggregatedAnalytics = {};

	// Initialize the result structure with zeroed arrays
	metrics.forEach((metric) => {
		const maxLength = Math.max(
			0,
			...items.map((item) => item[metric]?.length || 0),
		); // Ensure a minimum length of 0
		aggregatedData[metric as string] = Array(maxLength).fill(0);
	});

	// Aggregate data by summing across all contributors
	items.forEach((item) => {
		metrics.forEach((metric) => {
			item[metric]?.forEach((value, index) => {
				aggregatedData[metric as string][index] += value;
			});
		});
	});

	return aggregatedData;
}
