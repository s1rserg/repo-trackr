import { loadAll, loadAllProjects } from "./actions.js";
import { actions } from "./text.slice.js";

const allActions = {
	...actions,
	loadAll,
	loadAllProjects,
};

export { allActions as actions };
export { reducer } from "./text.slice.js";
