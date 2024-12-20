import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
} from "~/libs/hooks/hooks.js";
import { actions as activityLogActions } from "~/modules/activity/activity.js";
import { formatDate, subtractDays } from "~/libs/helpers/helpers.js";
import { actions as issueActions } from "~/modules/issues/issues.js";
import { actions as pullActions } from "~/modules/pulls/pulls.js";
import { actions as textActions } from "~/modules/texts/texts.js";
import { DataStatus } from "~/libs/enums/data-status.enum.js";
import styles from "./styles.module.css";
import { Loader } from "~/libs/components/components.js";
import { AnalyticsChart } from "../analytics-chart/analytics-chart.js";
import { aggregateAnalytics } from "../../helpers/helpers.js";

type Properties = {
	projectId: number;
};

const ProjectAnalytics = ({
	projectId,
}: Properties): JSX.Element | undefined => {
	const dispatch = useAppDispatch();

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
				projectId,
				endDate: formatDate(new Date(), "yyyy-MM-dd"),
				startDate: formatDate(startMonthDate, "yyyy-MM-dd"),
			}),
		);
	}, [dispatch, projectId, startMonthDate]);

	const handleLoadIssues = useCallback(() => {
		void dispatch(
			issueActions.loadAll({
				projectId,
				endDate: formatDate(new Date(), "yyyy-MM-dd"),
				startDate: formatDate(startMonthDate, "yyyy-MM-dd"),
			}),
		);
	}, [dispatch, projectId, startMonthDate]);

	const handleLoadPulls = useCallback(() => {
		void dispatch(
			pullActions.loadAll({
				projectId,
				endDate: formatDate(new Date(), "yyyy-MM-dd"),
				startDate: formatDate(startMonthDate, "yyyy-MM-dd"),
			}),
		);
	}, [dispatch, projectId, startMonthDate]);

	const handleLoadTexts = useCallback(() => {
		void dispatch(
			textActions.loadAll({
				projectId,
				endDate: formatDate(new Date(), "yyyy-MM-dd"),
				startDate: formatDate(startMonthDate, "yyyy-MM-dd"),
			}),
		);
	}, [dispatch, projectId, startMonthDate]);

	useEffect(() => {
		handleLoadActivityLogs();
		handleLoadIssues();
		handleLoadPulls();
		handleLoadTexts();
	}, [projectId]);

	const aggregatedActivityLogs = aggregateAnalytics(activityLogs, [
		"commitsNumber",
		"linesAdded",
		"linesDeleted",
	]);

	const aggregatedIssues = aggregateAnalytics(issues, [
		"issuesOpened",
		"issuesOpenedClosed",
		"issuesAssigned",
		"issuesAssignedClosed",
	]);

	const aggregatedPulls = aggregateAnalytics(pulls, [
		"pullsOpened",
		"pullsOpenedMerged",
		"pullsAssigned",
		"pullsAssignedMerged",
	]);

	const aggregatedTexts = aggregateAnalytics(texts, [
		"comments",
		"pullReviews",
	]);

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
			<AnalyticsChart data={aggregatedActivityLogs.commitsNumber} title="Commits Number" />
			<AnalyticsChart data={aggregatedActivityLogs.linesAdded} title="Lines added" />
			<AnalyticsChart data={aggregatedActivityLogs.linesDeleted} title="Lines deleted" />
			<AnalyticsChart data={aggregatedActivityLogs.commitsNumber} title="Commits Number" />
			<AnalyticsChart data={aggregatedActivityLogs.commitsNumber} title="Commits Number" />
			{/* <AnalyticsChart data={aggregatedIssues} title="Issues" />
			<AnalyticsChart data={aggregatedPulls} title="Pull Requests" />
			<AnalyticsChart data={aggregatedTexts} title="Texts" /> */}
		</>
	);
};

export { ProjectAnalytics };
