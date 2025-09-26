import { PrismaService } from "@/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ChatType, Prisma } from "@telegram-clone/database";

import { ChatsFilterDto } from "./dto/chat.filter.dto";
import { CreateGroupChatDto } from "./dto/create-group-chat.dto";

@Injectable()
export class ChatsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async startPrivateChat(targetUserId: string, currentUserId: string) {
    const existingChats = await this.prismaService.chat.findMany({
      where: {
        type: ChatType.PRIVATE,
        members: {
          every: {
            userId: {
              in: [currentUserId, targetUserId],
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (existingChats.length) {
      return existingChats[0];
    }

    return this.prismaService.chat.create({
      data: {
        type: ChatType.PRIVATE,
        members: {
          create: [{ userId: currentUserId }, { userId: targetUserId }],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async createGroupChat(
    createGroupChatDto: CreateGroupChatDto,
    currentUserId: string
  ) {
    const { name } = createGroupChatDto;

    return this.prismaService.chat.create({
      data: {
        type: ChatType.GROUP,
        name,
        members: {
          create: [{ userId: currentUserId }],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async findUserChats(userId: string, filterDto: ChatsFilterDto) {
    const { page, pageSize, type } = filterDto;

    const skip = (page - 1) * pageSize;

    const where: Prisma.ChatWhereInput = {
      members: {
        some: {
          userId,
        },
      },
      type,
    };

    const [chats, total] = await Promise.all([
      this.prismaService.chat.findMany({
        where,
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatarUrl: true,
                },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.chat.count({
        where,
      }),
    ]);

    return {
      data: chats,
      total,
      page,
      pageSize,
    };
  }

  async findChatById(chatId: string, userId: string) {
    return this.prismaService.chat.findFirst({
      where: {
        id: chatId,
        members: {
          some: {
            userId, // Check if user is a member of the chat
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async addMemberToChat(
    chatId: string,
    memberId: string,
    currentUserId: string
  ) {
    const chat = await this.findChatById(chatId, currentUserId);

    if (!chat) {
      return null;
    }

    const existingMember = await this.prismaService.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId: memberId,
        },
      },
    });

    if (existingMember) {
      return chat;
    }

    await this.prismaService.chatMember.create({
      data: {
        chatId,
        userId: memberId,
      },
    });

    return this.findChatById(chatId, currentUserId);
  }

  async removeMemberFromChat(
    chatId: string,
    userId: string,
    currentUserId: string
  ) {
    const chat = await this.findChatById(chatId, currentUserId);

    if (!chat) {
      return null;
    }

    if (chat.type === ChatType.PRIVATE) {
      throw new BadRequestException("Cannot remove members from private chats");
    }

    await this.prismaService.chatMember.deleteMany({
      where: {
        chatId,
        userId,
      },
    });

    return this.findChatById(chatId, currentUserId);
  }

  async deleteChat(chatId: string, userId: string) {
    const chat = await this.findChatById(chatId, userId);

    if (!chat) {
      return null;
    }

    return this.prismaService.chat.delete({
      where: { id: chatId },
    });
  }
}
