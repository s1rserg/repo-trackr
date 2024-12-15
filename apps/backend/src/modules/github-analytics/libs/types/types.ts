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
	message: string;
	stats: CommitStatsDto | undefined
};
export type CommitStatsDto = {
	additions: number;
	deletions: number;
	total: number;
};
export type CommitResponseDto = {
	commit: CommitDto;
	url: string;
	stats: CommitStatsDto | undefined
}[];
