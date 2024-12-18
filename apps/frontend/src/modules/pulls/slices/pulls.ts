import { loadAll, loadAllProjects } from "./actions.js";
import { actions } from "./pull.slice.js";

const allActions = {
	...actions,
	loadAll,
	loadAllProjects,
};

export { allActions as actions };
export { reducer } from "./pull.slice.js";
