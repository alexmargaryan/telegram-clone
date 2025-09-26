import { ZodSerializerDto } from "nestjs-zod";

import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/auth/jwt/jwt-auth.guard";
import {
  ApiPaginatedResponse,
  ApiQueryAll,
} from "@/common/decorators/swagger.decorators";
import { UuidValidationPipe } from "@/pipes/uuid.pipe";
import { UserResponseDto } from "@/resources/users/dto/user.dto";
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { ChatsService } from "./chats.service";
import { AddMemberDto } from "./dto/add-member.dto";
import { ChatResponseDto, ChatsResponseDto } from "./dto/chat.dto";
import { ChatsFilterDto, ChatsFilterSchema } from "./dto/chat.filter.dto";
import { CreateGroupChatDto } from "./dto/create-group-chat.dto";
import { StartPrivateChatDto } from "./dto/start-private-chat.dto";

@ApiTags("Chats")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("chats")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post("private")
  @ApiOperation({ summary: "Start a private chat with another user" })
  @ApiCreatedResponse({ type: ChatResponseDto })
  @ZodSerializerDto(ChatResponseDto)
  async startPrivateChat(
    @Body() startPrivateChatDto: StartPrivateChatDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.chatsService.startPrivateChat(startPrivateChatDto, user.id);
  }

  @Post("group")
  @ApiOperation({ summary: "Create a new group chat" })
  @ApiCreatedResponse({ type: ChatResponseDto })
  @ZodSerializerDto(ChatResponseDto)
  async createGroupChat(
    @Body() createGroupChatDto: CreateGroupChatDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.chatsService.createGroupChat(createGroupChatDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get user's chats" })
  @ApiQueryAll(ChatsFilterSchema)
  @ApiPaginatedResponse(ChatResponseDto)
  @ZodSerializerDto(ChatsResponseDto)
  async findUserChats(
    @Query() filterDto: ChatsFilterDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.chatsService.findUserChats(filterDto, user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user's specific chat" })
  @ApiOkResponse({ type: ChatResponseDto })
  @ZodSerializerDto(ChatResponseDto)
  async findChatById(
    @Param("id", UuidValidationPipe) id: string,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.chatsService.findChatById(id, user.id);
  }

  @Post(":id/members")
  @ApiOperation({ summary: "Add a member to a chat" })
  @ApiOkResponse({ type: ChatResponseDto })
  @ZodSerializerDto(ChatResponseDto)
  async addMember(
    @Param("id", UuidValidationPipe) id: string,
    @Body() addMemberDto: AddMemberDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.chatsService.addMemberToChat(id, addMemberDto.userId, user.id);
  }

  @Delete(":id/members/:userId")
  @ApiOperation({ summary: "Remove a member from a chat" })
  @ApiOkResponse({ type: ChatResponseDto })
  @ZodSerializerDto(ChatResponseDto)
  async removeMember(
    @Param("id", UuidValidationPipe) id: string,
    @Param("userId", UuidValidationPipe) userId: string,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.chatsService.removeMemberFromChat(id, userId, user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a chat" })
  @ApiOkResponse()
  async deleteChat(
    @Param("id", UuidValidationPipe) id: string,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.chatsService.deleteChat(id, user.id);
  }
}
