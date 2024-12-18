import { Table } from "~/libs/components/components.js";
import { getDateRange } from "~/libs/helpers/helpers.js";
import { type ActivityLogGetAllItemAnalyticsResponseDto } from "~/modules/activity/activity.js";

import {
	getAnalyticsColumns,
	getAnalyticsRows,
} from "../../helpers/helpers.js";
import { type AnalyticsRow } from "../../types/types.js";
import styles from "./styles.module.css";

type MetricConfig = {
	key: string; // e.g., 'commitsNumber', 'linesAdded'
	label: string; // e.g., 'Commits', 'Lines Added'
  };
  
  type Properties = {
	activityLogs: ActivityLogGetAllItemAnalyticsResponseDto[];
	dateRange: [Date, Date];
	emptyPlaceholder: string;
	isLoading: boolean;
	metrics: MetricConfig[];
  };
  
  const AnalyticsTable = ({
	activityLogs,
	dateRange,
	emptyPlaceholder,
	isLoading,
	metrics,
  }: Properties): JSX.Element => {
	const [startDate, endDate] = dateRange;
	const dateRangeFormatted = getDateRange(startDate, endDate);
  
	const metricKeys = metrics.map((metric) => metric.key);
  
	const analyticsColumns = getAnalyticsColumns(
	  dateRangeFormatted,
	  metricKeys,
	  styles["analytics-empty-cell"],
	);
  
	const analyticsData: AnalyticsRow[] = getAnalyticsRows(activityLogs, metricKeys);
  
	return (
	  <div className={styles["analytics-table"]}>
		<Table<AnalyticsRow>
		  columns={analyticsColumns}
		  data={analyticsData}
		  emptyPlaceholder={emptyPlaceholder}
		  isFullHeight
		  isLoading={isLoading}
		/>
	  </div>
	);
  };
  
  export { AnalyticsTable };
  
