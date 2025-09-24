import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prismaService.user.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async removeUser(id: string) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });
  }
}
