import {
	create,
	deleteById,
	getById,
	loadAll,
	loadAllContributorsActivityByProjectId,
	loadAllContributorsByProjectId,
	patch,
	configureAnalytics
} from "./actions.js";
import { actions } from "./project.slice.js";

const allActions = {
	...actions,
	create,
	deleteById,
	getById,
	loadAll,
	loadAllContributorsActivityByProjectId,
	loadAllContributorsByProjectId,
	patch,
	configureAnalytics
};

export { allActions as actions };
export { reducer } from "./project.slice.js";
