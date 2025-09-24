import { Role } from "@telegram-clone/database";
import { Test, TestingModule } from "@nestjs/testing";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user.dto";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

const mockUsersService = {
  createUser: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateUser: jest.fn(),
  removeUser: jest.fn(),
} satisfies Partial<jest.Mocked<UsersService>>;

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the current user from /me", async () => {
    const mockUser: UserResponseDto = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: Role.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await controller.me(mockUser);

    expect(result).toEqual(mockUser);
  });

  it("should call service.createUser on POST /", async () => {
    const dto: CreateUserDto = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "1234",
    };

    await controller.createUser(dto);

    expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
  });

  it("should return all users from GET /", async () => {
    const users: UserResponseDto[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: Role.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockUsersService.findAll.mockResolvedValue(users);

    const result = await controller.findAll();

    expect(result).toEqual(users);
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });

  it("should return a user from GET /:id", async () => {
    const user: UserResponseDto = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: Role.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsersService.findOne.mockResolvedValue(user);

    const result = await controller.findOne("1");

    expect(result).toEqual(user);
    expect(mockUsersService.findOne).toHaveBeenCalledWith("1");
  });

  it("should call updateUser on PATCH /:id", async () => {
    const dto: UpdateUserDto = {
      firstName: "Updated",
      lastName: "User",
      email: "updated@example.com",
      password: "4321",
    };

    await controller.updateUser("1", dto);

    expect(mockUsersService.updateUser).toHaveBeenCalledWith("1", dto);
  });

  it("should call removeUser on DELETE /:id", async () => {
    await controller.removeUser("1");

    expect(mockUsersService.removeUser).toHaveBeenCalledWith("1");
  });
});
