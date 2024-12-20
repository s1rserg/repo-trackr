import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useParams,
} from "~/libs/hooks/hooks.js";
import { actions as activityLogActions } from "~/modules/activity/activity.js";
import { formatDate, subtractDays } from "~/libs/helpers/helpers.js";
import { actions as issueActions } from "~/modules/issues/issues.js";
import { actions as pullActions } from "~/modules/pulls/pulls.js";
import { actions as textActions } from "~/modules/texts/texts.js";
import { DataStatus } from "~/libs/enums/data-status.enum.js";
import { Loader, PageLayout } from "~/libs/components/components.js";
import { AnalyticsChart } from "../project/libs/components/analytics-chart/analytics-chart.js";
import {
	MetricCard,
	MetricsCards,
} from "../project/libs/components/metrics-cards/metrics-cards.js";
import { calculateMetrics } from "../project/libs/helpers/calculate-metrics.js";
import styles from "./styles.module.css";

const Contributor = (): JSX.Element | undefined => {
	const dispatch = useAppDispatch();
	const { projectId: projectId, contributorName } = useParams<{
		projectId: string;
		contributorName: string;
	}>();

	const { activityLogs, dataStatus: activityLogStatus } = useAppSelector(
		({ activityLogs }) => activityLogs,
	);
	const { issues, dataStatus: issuesStatus } = useAppSelector(
		({ issues }) => issues,
	);
	const { pulls, dataStatus: pullsStatus } = useAppSelector(
		({ pulls }) => pulls,
	);
	const { texts, dataStatus: textsStatus } = useAppSelector(
		({ texts }) => texts,
	);

	const startMonthDate = subtractDays(new Date(), 30);

	const handleLoadActivityLogs = useCallback(() => {
		void dispatch(
			activityLogActions.loadAll({
				projectId: +(projectId || 0),
				contributorName,
				endDate: formatDate(new Date(), "yyyy-MM-dd"),
				startDate: formatDate(startMonthDate, "yyyy-MM-dd"),
			}),
		);
	}, [contributorName, dispatch, projectId, startMonthDate]);

	const handleLoadIssues = useCallback(() => {
		void dispatch(
			issueActions.loadAll({
				projectId: +(projectId || 0),
				contributorName,
				endDate: formatDate(new Date(), "yyyy-MM-dd"),
				startDate: formatDate(startMonthDate, "yyyy-MM-dd"),
			}),
		);
	}, [contributorName, dispatch, projectId, startMonthDate]);

	const handleLoadPulls = useCallback(() => {
		void dispatch(
			pullActions.loadAll({
				projectId: +(projectId || 0),
				contributorName,
				endDate: formatDate(new Date(), "yyyy-MM-dd"),
				startDate: formatDate(startMonthDate, "yyyy-MM-dd"),
			}),
		);
	}, [contributorName, dispatch, projectId, startMonthDate]);

	const handleLoadTexts = useCallback(() => {
		void dispatch(
			textActions.loadAll({
				projectId: +(projectId || 0),
				contributorName,
				endDate: formatDate(new Date(), "yyyy-MM-dd"),
				startDate: formatDate(startMonthDate, "yyyy-MM-dd"),
			}),
		);
	}, [contributorName, dispatch, projectId, startMonthDate]);

	useEffect(() => {
		handleLoadActivityLogs();
		handleLoadIssues();
		handleLoadPulls();
		handleLoadTexts();
	}, [projectId]);

	const isLoading =
		activityLogStatus === DataStatus.IDLE ||
		issuesStatus === DataStatus.IDLE ||
		pullsStatus === DataStatus.IDLE ||
		textsStatus === DataStatus.IDLE ||
		activityLogStatus === DataStatus.PENDING ||
		issuesStatus === DataStatus.PENDING ||
		pullsStatus === DataStatus.PENDING ||
		textsStatus === DataStatus.PENDING;

	if (isLoading) {
		return <Loader />;
	}

	return (
		<>
			<PageLayout isLoading={isLoading}>
				<h1>{contributorName}</h1>
				<p>Project: {projectId}</p>
				<h2>Analytics Dashboard</h2>
				<AnalyticsChart
					data={activityLogs[0].commitsNumber || []}
					title="Commits Number"
				/>
				<MetricsCards
					{...calculateMetrics(activityLogs[0].commitsNumber || [])}
				/>
				<AnalyticsChart
					data={activityLogs[0].linesAdded || []}
					title="Lines added"
				/>
				<MetricsCards {...calculateMetrics(activityLogs[0].linesAdded || [])} />
				<AnalyticsChart
					data={activityLogs[0].linesDeleted || []}
					title="Lines deleted"
				/>
				<MetricsCards
					{...calculateMetrics(activityLogs[0].linesDeleted || [])}
				/>
				<AnalyticsChart
					data={issues[0].issuesOpened || []}
					title="Issues opened"
				/>
				<MetricsCards {...calculateMetrics(issues[0].issuesOpened || [])} />
				<AnalyticsChart
					data={issues[0].issuesAssigned || []}
					title="Issues assigned"
				/>
				<MetricsCards {...calculateMetrics(issues[0].issuesAssigned || [])} />
				<AnalyticsChart
					data={issues[0].issuesOpenedClosed || []}
					title="Issues closed"
				/>
				<MetricsCards
					{...calculateMetrics(issues[0].issuesOpenedClosed || [])}
				/>
				<AnalyticsChart
					data={pulls[0].pullsOpened || []}
					title="Pull requests opened"
				/>
				<MetricsCards {...calculateMetrics(pulls[0].pullsOpened || [])} />
				<AnalyticsChart
					data={pulls[0].pullsAssigned || []}
					title="Pull requests assigned"
				/>
				<MetricsCards {...calculateMetrics(pulls[0].pullsAssigned || [])} />
				<AnalyticsChart
					data={pulls[0].pullsOpenedMerged || []}
					title="Pull requests closed"
				/>
				<MetricsCards {...calculateMetrics(pulls[0].pullsOpenedMerged || [])} />
				<AnalyticsChart
					data={texts[0].comments || []}
					title="Comments written"
				/>
				<MetricsCards {...calculateMetrics(texts[0].comments || [])} />
				<AnalyticsChart
					data={texts[0].pullReviews || []}
					title="Pull reviews written"
				/>
				<MetricsCards {...calculateMetrics(texts[0].pullReviews || [])} />
				<h2>Emotional Analysis</h2>
				<div className={styles["metricsContainer"]}>
					<MetricCard
						title="Average Sentiment Score"
						value={texts[0]?.averageSentimentScore?.toString() || "-"}
					/>
					<MetricCard
						title="Top 1 Sentiment Label"
						value={texts[0]?.topSentimentLabels[0] || "-"}
					/>
					<MetricCard
						title="Top 2 Sentiment Label"
						value={texts[0]?.topSentimentLabels[1] || "-"}
					/>
					<MetricCard
						title="Top 3 Sentiment Label"
						value={texts[0]?.topSentimentLabels[2] || "-"}
					/>
					<MetricCard
						title="Top 4 Sentiment Label"
						value={texts[0]?.topSentimentLabels[3] || "-"}
					/>
					<MetricCard
						title="Top 5 Sentiment Label"
						value={texts[0]?.topSentimentLabels[4] || "-"}
					/>
				</div>
			</PageLayout>
		</>
	);
};

export { Contributor };
