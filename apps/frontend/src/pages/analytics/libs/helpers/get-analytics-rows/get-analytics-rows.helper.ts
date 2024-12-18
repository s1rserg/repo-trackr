import { type ActivityLogGetAllItemAnalyticsResponseDto } from "~/modules/activity/activity.js";
import { type AnalyticsRow } from "../../types/types.js";

const getAnalyticsRows = (
	activityLogs: ActivityLogGetAllItemAnalyticsResponseDto[],
	metrics: string[],
): AnalyticsRow[] => {
	return activityLogs.map((log) => {
		const metricsData = metrics.reduce<Record<string, (number | string)[]>>(
			(acc, metric) => {
				acc[metric] = log[
					metric as keyof ActivityLogGetAllItemAnalyticsResponseDto
				] as (number | string)[];

				return acc;
			},
			{},
		);

		return {
			contributorId: log.contributor.id,
			contributorName: log.contributor.name,
			metrics: metricsData,
		};
	});
};

export { getAnalyticsRows };
