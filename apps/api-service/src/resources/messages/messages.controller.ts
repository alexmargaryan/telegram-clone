import { ZodSerializerDto } from "nestjs-zod";

import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "@/auth/jwt/jwt-auth.guard";
import { ApiPaginatedResponse } from "@/common/decorators/swagger.decorators";
import { UuidValidationPipe } from "@/pipes/uuid.pipe";
import { UserResponseDto } from "@/resources/users/dto/user.dto";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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

import { CreateMessageDto } from "./dto/create-message.dto";
import {
  MessageReactionDto,
  MessageReactionsResponseDto,
} from "./dto/message-reaction.dto";
import { MessageResponseDto, MessagesResponseDto } from "./dto/message.dto";
import { MessagesFilterDto } from "./dto/message.filter.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { MessagesService } from "./messages.service";

@ApiTags("Messages")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: "Send a new message" })
  @ApiCreatedResponse({ type: MessageResponseDto })
  @ZodSerializerDto(MessageResponseDto)
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.messagesService.createMessage(createMessageDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get messages from a chat" })
  @ApiPaginatedResponse(MessageResponseDto)
  @ZodSerializerDto(MessagesResponseDto)
  async findChatMessages(
    @Query() filterDto: MessagesFilterDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.messagesService.findChatMessages(filterDto, user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific message" })
  @ApiOkResponse({ type: MessageResponseDto })
  @ZodSerializerDto(MessageResponseDto)
  async findMessageById(
    @Param("id", UuidValidationPipe) id: string,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.messagesService.findMessageById(id, user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Edit a message" })
  @ApiOkResponse({ type: MessageResponseDto })
  @ZodSerializerDto(MessageResponseDto)
  async updateMessage(
    @Param("id", UuidValidationPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.messagesService.updateMessage(id, updateMessageDto, user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a message" })
  @ApiOkResponse()
  async deleteMessage(
    @Param("id", UuidValidationPipe) id: string,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.messagesService.deleteMessage(id, user.id);
  }

  @Post(":id/reactions")
  @ApiOperation({ summary: "Add a reaction to a message" })
  @ApiCreatedResponse()
  async addReaction(
    @Param("id", UuidValidationPipe) id: string,
    @Body() reactionDto: MessageReactionDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.messagesService.addReaction(id, reactionDto, user.id);
  }

  @Delete(":id/reactions")
  @ApiOperation({ summary: "Remove a reaction from a message" })
  @ApiOkResponse()
  async removeReaction(
    @Param("id", UuidValidationPipe) id: string,
    @Body() reactionDto: MessageReactionDto,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.messagesService.removeReaction(id, reactionDto, user.id);
  }

  @Get(":id/reactions")
  @ApiOperation({ summary: "Get all reactions for a message" })
  @ApiOkResponse({ type: MessageReactionsResponseDto, isArray: true })
  async getMessageReactions(
    @Param("id", UuidValidationPipe) id: string,
    @CurrentUser() user: UserResponseDto
  ) {
    return this.messagesService.getMessageReactions(id, user.id);
  }
}
