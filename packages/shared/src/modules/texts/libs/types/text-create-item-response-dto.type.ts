import { type TextCreateItemRequestDto } from "./text-create-item-request-dto.type.js";

type TextCreateItemResponseDto = {
	logItem: TextCreateItemRequestDto;
	projectId: number;
};

export { type TextCreateItemResponseDto };
