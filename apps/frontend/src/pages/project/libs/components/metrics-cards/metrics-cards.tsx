import React from "react";
import styles from "./styles.module.css";
import { AnimatedNumber } from "../animated-number/animated-number.js";

interface MetricCardProps {
	title: string;
	value: number | string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
	return (
		<div className={styles["card"]}>
			{typeof value === "number" ? (
				<AnimatedNumber end={value} />
			) : (
				<span>{value}</span>
			)}
			<h3 className={styles["cardTitle"]}>{title}</h3>
		</div>
	);
};

interface MetricsCardsProps {
	totalMonth: number;
	totalWeek: number;
	maxMonth: number;
	maxWeek: number;
	mostProductiveDay: string;
	daysWithZeroActivity: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
	totalMonth,
	totalWeek,
	maxMonth,
	maxWeek,
	mostProductiveDay,
	daysWithZeroActivity,
}) => {
	return (
		<div className={styles["metricsContainer"]}>
			<MetricCard title="Total in Month" value={totalMonth} />
			<MetricCard title="Total in Week" value={totalWeek} />
			<MetricCard title="Max in Month" value={maxMonth} />
			<MetricCard title="Max in Week" value={maxWeek} />
			<MetricCard title="Most Productive Day" value={mostProductiveDay} />
			<MetricCard
				title="Days with Zero Activity"
				value={daysWithZeroActivity}
			/>
		</div>
	);
};

export { MetricsCards, MetricCard };
