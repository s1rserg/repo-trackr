import { loadAll, loadAllProjects } from "./actions.js";
import { actions } from "./issue.js";

const allActions = {
	...actions,
	loadAll,
	loadAllProjects,
};

export { allActions as actions };
export { reducer } from "./issue.js";
