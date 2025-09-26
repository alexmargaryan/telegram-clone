import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageReactionDto } from "./dto/message-reaction.dto";
import { MessagesFilterDto } from "./dto/message.filter.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";

@Injectable()
export class MessagesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
    return this.prismaService.message.create({
      data: {
        ...createMessageDto,
        senderId,
      },
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
        replyToMessage: {
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
        reactions: {
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
      },
    });
  }

  async findChatMessages(filterDto: MessagesFilterDto, userId: string) {
    const { chatId, page, pageSize } = filterDto;

    const skip = (page - 1) * pageSize;

    const chatAccess = await this.prismaService.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
    });

    if (!chatAccess) {
      return null;
    }

    const [messages, total] = await Promise.all([
      this.prismaService.message.findMany({
        where: {
          chatId,
          isDeleted: false,
        },
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
          replyToMessage: {
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
          reactions: {
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
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.message.count({
        where: {
          chatId,
          isDeleted: false,
        },
      }),
    ]);

    return {
      data: messages,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Finds a message by its ID that the user has access to.
   */
  async findOne(messageId: string, userId: string) {
    return this.prismaService.message.findFirst({
      where: {
        id: messageId,
        chat: {
          members: {
            some: {
              userId,
            },
          },
        },
        isDeleted: false,
      },
    });
  }

  /**
   * Finds a message by its ID that the user has access to with additional data.
   */
  async findMessageById(messageId: string, userId: string) {
    const message = await this.prismaService.message.findFirst({
      where: {
        id: messageId,
        chat: {
          members: {
            some: {
              userId,
            },
          },
        },
        isDeleted: false,
      },
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
        replyToMessage: {
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
        reactions: {
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
      },
    });

    return message;
  }

  async updateMessage(
    messageId: string,
    updateMessageDto: UpdateMessageDto,
    userId: string
  ) {
    const message = await this.prismaService.message.findFirst({
      where: {
        id: messageId,
        senderId: userId,
        isDeleted: false,
      },
    });

    if (!message) {
      return null;
    }

    return this.prismaService.message.update({
      where: { id: messageId },
      data: {
        ...updateMessageDto,
        isEdited: true,
      },
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
        replyToMessage: {
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
        reactions: {
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
      },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prismaService.message.findFirst({
      where: {
        id: messageId,
        senderId: userId,
        isDeleted: false,
      },
    });

    if (!message) {
      return null;
    }

    return this.prismaService.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
      },
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
        replyToMessage: {
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
        reactions: {
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
      },
    });
  }

  async addReaction(
    messageId: string,
    reactionDto: MessageReactionDto,
    userId: string
  ) {
    const message = await this.findOne(messageId, userId);

    if (!message) {
      return null;
    }

    const existingReaction =
      await this.prismaService.messageReaction.findUnique({
        where: {
          messageId_userId_emoji: {
            messageId,
            userId,
            emoji: reactionDto.emoji,
          },
        },
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
      });

    if (existingReaction) {
      return existingReaction;
    }

    return this.prismaService.messageReaction.create({
      data: {
        messageId,
        userId,
        emoji: reactionDto.emoji,
      },
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
    });
  }

  async removeReaction(
    messageId: string,
    reactionDto: MessageReactionDto,
    userId: string
  ) {
    const message = await this.findOne(messageId, userId);

    if (!message) {
      return null;
    }

    await this.prismaService.messageReaction.deleteMany({
      where: {
        messageId,
        userId,
        emoji: reactionDto.emoji,
      },
    });

    return true;
  }

  async getMessageReactions(messageId: string, userId: string) {
    const message = await this.findOne(messageId, userId);

    if (!message) {
      return null;
    }

    return this.prismaService.messageReaction.findMany({
      where: {
        messageId,
      },
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
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
