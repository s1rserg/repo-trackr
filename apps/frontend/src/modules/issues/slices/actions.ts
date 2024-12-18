import { createAsyncThunk } from "@reduxjs/toolkit";

import { type AsyncThunkConfig } from "~/libs/types/types.js";
import { type ProjectGetAllItemResponseDto } from "~/modules/projects/projects.js";

import {
	type ActivityLogGetAllAnalyticsResponseDto,
	type ActivityLogQueryParameters,
} from "../libs/types/types.js";
import { name as sliceName } from "./issue.js";

const loadAll = createAsyncThunk<
	ActivityLogGetAllAnalyticsResponseDto,
	ActivityLogQueryParameters,
	AsyncThunkConfig
>(`${sliceName}/load-all`, async (query, { extra }) => {
	const { activityLogApi } = extra;

	return await activityLogApi.getAll(query);
});

const loadAllProjects = createAsyncThunk<
	ProjectGetAllItemResponseDto[],
	undefined,
	AsyncThunkConfig
>(`${sliceName}/load-all-projects`, async (_, { extra }) => {
	const { projectApi } = extra;

	return await projectApi.getAllWithoutPagination();
});

export { loadAll, loadAllProjects };
