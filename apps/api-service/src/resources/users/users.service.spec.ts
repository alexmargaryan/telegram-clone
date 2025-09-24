import { Role } from "@telegram-clone/database";
import { Test, TestingModule } from "@nestjs/testing";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDto } from "./dto/user.dto";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";

const mockUsersRepository = {
  createUser: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateUser: jest.fn(),
  removeUser: jest.fn(),
  updateRefreshToken: jest.fn(),
} satisfies Partial<jest.Mocked<UsersRepository>>;

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call createUser with correct args", async () => {
    const dto: CreateUserDto = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: "1234",
    };

    await service.createUser(dto);

    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(dto);
  });

  it("should return all users", async () => {
    const users: UserResponseDto[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        role: Role.USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        firstName: "Jane",
        lastName: "Doe",
        email: "test2@example.com",
        role: Role.ADMIN,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockUsersRepository.findAll.mockResolvedValue(users);
    const result = await service.findAll();

    expect(result).toEqual(users);
    expect(mockUsersRepository.findAll).toHaveBeenCalled();
  });

  it("should return one user by id", async () => {
    const user: UserResponseDto = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      role: Role.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsersRepository.findOne.mockResolvedValue(user);
    const result = await service.findOne("1");

    expect(result).toEqual(user);
    expect(mockUsersRepository.findOne).toHaveBeenCalledWith("1");
  });

  it("should call updateUser with correct args", async () => {
    const dto: UpdateUserDto = {
      firstName: "Updated",
      lastName: "Updated",
      email: "updated@example.com",
      password: "1234",
    };

    await service.updateUser("1", dto);

    expect(mockUsersRepository.updateUser).toHaveBeenCalledWith("1", dto);
  });

  it("should call removeUser with correct id", async () => {
    await service.removeUser("1");

    expect(mockUsersRepository.removeUser).toHaveBeenCalledWith("1");
  });

  it("should call updateRefreshToken with correct args", async () => {
    await service.updateRefreshToken("1", "newToken");

    expect(mockUsersRepository.updateRefreshToken).toHaveBeenCalledWith(
      "1",
      "newToken"
    );
  });
});
