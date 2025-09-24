import { ZodSerializerDto } from "nestjs-zod";

import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { RestrictTo } from "@/auth/decorators/roles.decorator";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { UuidValidationPipe } from "@/pipes/uuid.pipe";
import { Role } from "@telegram-clone/database";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Header,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user.dto";
import { UsersService } from "./users.service";

@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  @ApiOkResponse({ type: UserResponseDto })
  @ZodSerializerDto(UserResponseDto)
  @Header("Cache-Control", "no-store, no-cache, must-revalidate")
  async me(@CurrentUser() user: UserResponseDto) {
    return user;
  }

  // TODO: Remove this endpoint, now when we create a user, the password stored in db without hashing
  @Post()
  @ApiCreatedResponse({ type: UserResponseDto })
  @ZodSerializerDto(UserResponseDto)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @RestrictTo(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  @ZodSerializerDto(UserResponseDto)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @ApiOkResponse({ type: UserResponseDto })
  @ZodSerializerDto(UserResponseDto)
  async findOne(@Param("id", UuidValidationPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOkResponse()
  async updateUser(
    @Param("id", UuidValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  @RestrictTo(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOkResponse()
  async removeUser(@Param("id", UuidValidationPipe) id: string) {
    await this.usersService.removeUser(id);
  }
}
