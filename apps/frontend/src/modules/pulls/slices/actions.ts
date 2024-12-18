import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	type PullGetAllAnalyticsResponseDto,
	type PullQueryParameters,
	type AsyncThunkConfig,
} from "~/libs/types/types.js";
import { type ProjectGetAllItemResponseDto } from "~/modules/projects/projects.js";
import { name as sliceName } from "./pull.slice.js";

const loadAll = createAsyncThunk<
	PullGetAllAnalyticsResponseDto,
	PullQueryParameters,
	AsyncThunkConfig
>(`${sliceName}/load-all`, async (query, { extra }) => {
	const { pullApi } = extra;

	return await pullApi.getAll(query);
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
