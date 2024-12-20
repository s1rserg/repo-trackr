type MetricsResult = {
	totalMonth: number;
	totalWeek: number;
	maxMonth: number;
	maxWeek: number;
	mostProductiveDay: string;
	daysWithZeroActivity: number;
};

export const calculateMetrics = (metrics: number[]): MetricsResult => {
	// Helper function to get day names
	const getDayName = (dayIndex: number): string => {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		return days[dayIndex];
	};

	// Initialize variables
	const currentDate = new Date();
	const daysInMonth = metrics.length; // Assuming array length corresponds to days in the current month
	const weeklyBuckets: number[] = Array(5).fill(0); // Supports up to 5 weeks in a month
	const dayCounts = Array(7).fill(0); // To count activity by day of the week
	let totalMonth = 0;
	let maxMonth = 0;
	let daysWithZeroActivity = 0;

	metrics.forEach((value, index) => {
		// Aggregate total and max for the month
		totalMonth += value;
		maxMonth = Math.max(maxMonth, value);

		// Count zero-activity days
		if (value === 0) {
			daysWithZeroActivity += 1;
		}

		// Calculate weekly metrics
		const weekIndex = Math.floor(index / 7);
		weeklyBuckets[weekIndex] += value;

		// Determine the day of the week
		const dayIndex = (currentDate.getDay() + index - daysInMonth + 1) % 7;
		dayCounts[dayIndex] += value;
	});

	// Calculate weekly metrics
	const totalWeek = weeklyBuckets[weeklyBuckets.length - 1]; // Last week
	const maxWeek = Math.max(...weeklyBuckets);

	// Find the most productive day of the week
	const mostProductiveDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
	const mostProductiveDay = getDayName(mostProductiveDayIndex);

	return {
		totalMonth,
		totalWeek,
		maxMonth,
		maxWeek,
		mostProductiveDay,
		daysWithZeroActivity,
	};
};
