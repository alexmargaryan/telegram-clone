import { BadRequestException, NotFoundException } from "@/common/errors";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

import { UsersRepository } from "../users/users.repository";
import { ChatsRepository } from "./chats.repository";
import { ChatsFilterDto } from "./dto/chat.filter.dto";
import { CreateGroupChatDto } from "./dto/create-group-chat.dto";
import { StartPrivateChatDto } from "./dto/start-private-chat.dto";

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly prismaService: PrismaService
  ) {}

  async startPrivateChat(
    startPrivateChatDto: StartPrivateChatDto,
    currentUserId: string
  ) {
    const { userId: targetUserId } = startPrivateChatDto;

    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: [currentUserId, targetUserId],
        },
        deletedAt: null,
      },
    });

    if (users.length !== 2) {
      throw new BadRequestException("One or both users not found");
    }

    if (currentUserId === targetUserId) {
      throw new BadRequestException("Cannot start a chat with yourself");
    }

    return this.chatsRepository.startPrivateChat(targetUserId, currentUserId);
  }

  async createGroupChat(
    createGroupChatDto: CreateGroupChatDto,
    currentUserId: string
  ) {
    const user = await this.usersRepository.findOne(currentUserId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.chatsRepository.createGroupChat(
      createGroupChatDto,
      currentUserId
    );
  }

  async findUserChats(filterDto: ChatsFilterDto, userId: string) {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.chatsRepository.findUserChats(userId, filterDto);
  }

  async findChatById(chatId: string, userId: string) {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const chat = await this.chatsRepository.findChatById(chatId, userId);

    if (!chat) {
      throw new NotFoundException(
        "Chat not found or you don't have access to it"
      );
    }

    return chat;
  }

  async addMemberToChat(
    chatId: string,
    memberId: string,
    currentUserId: string
  ) {
    const existingChat = await this.chatsRepository.findChatById(
      chatId,
      currentUserId
    );

    if (!existingChat) {
      throw new NotFoundException("Chat not found");
    }

    if (existingChat.type === "PRIVATE") {
      throw new BadRequestException("Cannot add members to private chats");
    }

    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: [memberId, currentUserId],
        },
        deletedAt: null,
      },
    });

    if (users.length !== 2) {
      throw new BadRequestException("One or both users not found");
    }

    const chat = await this.chatsRepository.addMemberToChat(
      chatId,
      memberId,
      currentUserId
    );

    if (!chat) {
      throw new NotFoundException(
        "Chat not found or you don't have access to it"
      );
    }

    return chat;
  }

  async removeMemberFromChat(
    chatId: string,
    userId: string,
    currentUserId: string
  ) {
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: [userId, currentUserId],
        },
        deletedAt: null,
      },
    });

    if (users.length !== 2) {
      throw new BadRequestException("One or both users not found");
    }

    const chat = await this.chatsRepository.removeMemberFromChat(
      chatId,
      userId,
      currentUserId
    );

    if (!chat) {
      throw new NotFoundException(
        "Chat not found or you don't have access to it"
      );
    }

    return chat;
  }

  async deleteChat(chatId: string, userId: string) {
    const user = await this.usersRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const chat = await this.chatsRepository.deleteChat(chatId, userId);

    if (!chat) {
      throw new NotFoundException(
        "Chat not found or you don't have access to it"
      );
    }

    return chat;
  }
}
