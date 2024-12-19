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

type Properties = {
	projectId: number;
};

const ProjectAnalytics = ({ projectId }: Properties): JSX.Element => {
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
	}, [
		projectId,
		handleLoadActivityLogs,
		handleLoadIssues,
		handleLoadPulls,
		handleLoadTexts,
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

	return <></>;
};

export { ProjectAnalytics };
