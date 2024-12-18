import { createAsyncThunk } from "@reduxjs/toolkit";

import {
	type IssueGetAllAnalyticsResponseDto,
	type IssueQueryParameters,
	type AsyncThunkConfig,
} from "~/libs/types/types.js";
import { type ProjectGetAllItemResponseDto } from "~/modules/projects/projects.js";

import { name as sliceName } from "./issue.js";

const loadAll = createAsyncThunk<
	IssueGetAllAnalyticsResponseDto,
	IssueQueryParameters,
	AsyncThunkConfig
>(`${sliceName}/load-all`, async (query, { extra }) => {
	const { issueApi } = extra;

	return await issueApi.getAll(query);
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
