import { type PullCreateItemRequestDto } from "./pull-create-item-request-dto.type.js";

type PullCreateItemResponseDto = {
	logItem: PullCreateItemRequestDto;
	projectId: number;
};

export { type PullCreateItemResponseDto };
