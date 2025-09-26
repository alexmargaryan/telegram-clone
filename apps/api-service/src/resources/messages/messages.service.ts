import { BadRequestException, NotFoundException } from "@/common/errors";
import { Injectable } from "@nestjs/common";

import { ChatsRepository } from "../chats/chats.repository";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageReactionDto } from "./dto/message-reaction.dto";
import { MessagesFilterDto } from "./dto/message.filter.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly chatsRepository: ChatsRepository
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
    const { chatId } = createMessageDto;

    const chat = await this.chatsRepository.findChatById(chatId, senderId);

    if (!chat) {
      throw new NotFoundException(
        "Chat not found or you don't have access to it"
      );
    }

    if (createMessageDto.replyToMessageId) {
      const replyMessage = await this.messagesRepository.findOne(
        createMessageDto.replyToMessageId,
        senderId
      );

      if (!replyMessage) {
        throw new BadRequestException("Reply message not found or is deleted");
      }
    }

    return this.messagesRepository.createMessage(createMessageDto, senderId);
  }

  async findChatMessages(filterDto: MessagesFilterDto, userId: string) {
    const result = await this.messagesRepository.findChatMessages(
      filterDto,
      userId
    );

    if (!result) {
      throw new NotFoundException(
        "Chat not found or you don't have access to it"
      );
    }

    return result;
  }

  async findMessageById(messageId: string, userId: string) {
    const message = await this.messagesRepository.findMessageById(
      messageId,
      userId
    );

    if (!message) {
      throw new NotFoundException(
        "Message not found or you don't have access to it"
      );
    }

    return message;
  }

  async updateMessage(
    messageId: string,
    updateMessageDto: UpdateMessageDto,
    userId: string
  ) {
    const message = await this.messagesRepository.updateMessage(
      messageId,
      updateMessageDto,
      userId
    );

    if (!message) {
      throw new NotFoundException(
        "Message not found or you don't have permission to edit it"
      );
    }

    return message;
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messagesRepository.deleteMessage(
      messageId,
      userId
    );

    if (!message) {
      throw new NotFoundException(
        "Message not found or you don't have permission to delete it"
      );
    }
  }

  async addReaction(
    messageId: string,
    reactionDto: MessageReactionDto,
    userId: string
  ) {
    const reaction = await this.messagesRepository.addReaction(
      messageId,
      reactionDto,
      userId
    );

    if (!reaction) {
      throw new NotFoundException(
        "Message not found or you don't have access to it"
      );
    }
  }

  async removeReaction(
    messageId: string,
    reactionDto: MessageReactionDto,
    userId: string
  ) {
    const result = await this.messagesRepository.removeReaction(
      messageId,
      reactionDto,
      userId
    );

    if (!result) {
      throw new NotFoundException(
        "Reaction not found or you don't have access to it"
      );
    }
  }

  async getMessageReactions(messageId: string, userId: string) {
    const reactions = await this.messagesRepository.getMessageReactions(
      messageId,
      userId
    );

    if (!reactions) {
      throw new NotFoundException(
        "Message not found or you don't have access to it"
      );
    }

    return reactions;
  }
}
