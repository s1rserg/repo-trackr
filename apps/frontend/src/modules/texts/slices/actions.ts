import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	type TextGetAllAnalyticsResponseDto,
	type TextQueryParameters,
	type AsyncThunkConfig,
} from "~/libs/types/types.js";
import { type ProjectGetAllItemResponseDto } from "~/modules/projects/projects.js";
import { name as sliceName } from "./text.slice.js";

const loadAll = createAsyncThunk<
	TextGetAllAnalyticsResponseDto,
	TextQueryParameters,
	AsyncThunkConfig
>(`${sliceName}/load-all`, async (query, { extra }) => {
	const { textApi } = extra;

	return await textApi.getAll(query);
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
