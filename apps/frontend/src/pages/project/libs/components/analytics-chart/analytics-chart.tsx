import React from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import styles from "./styles.module.css";

interface AnalyticsChartProps {
	data: number[];
	title: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, title }) => {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(endDate.getDate() - (data.length - 1));

	// Generate mock data with dates
	const mockData = data.map((value, index) => {
		const date = new Date(startDate);
		date.setDate(startDate.getDate() + index);

		return {
			date: date.toISOString().split("T")[0],
			value,
		};
	});

	const last7DaysData = mockData.slice(-7);

	return (
		<div className={styles["container"]}>
			<h3 className={styles["title"]}>{title}</h3>
			<div className={styles["chartGrid"]}>
				<div className={styles["chartWrapper"]}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={mockData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="value"
								stroke="#2044DA"
								activeDot={{ r: 8 }}
								strokeWidth={3}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className={styles["chartWrapper"]}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={last7DaysData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="value"
								stroke="#1933A4"
								activeDot={{ r: 8 }}
								strokeWidth={3}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export { AnalyticsChart };
