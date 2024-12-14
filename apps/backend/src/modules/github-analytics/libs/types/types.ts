export { type CommitStatistics } from "./commit-statistics.type.js";
export {
	type ActivityLogCreateItemRequestDto,
	type ActivityLogCreateRequestDto,
	type ActivityLogGetAllItemResponseDto,
	type ActivityLogGetAllResponseDto,
	type ContributorGetAllItemResponseDto,
} from "@repo-trackr/shared";
export type CommitAuthorDto = {
	name: string;
	email: string;
	date: string;
};
export type CommitDto = {
	author: CommitAuthorDto;
};
export type CommitResponseDto = {
	commit: CommitDto;
}[];
