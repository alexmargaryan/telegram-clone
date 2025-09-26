import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@/common/errors";
import { PrismaService } from "@/prisma/prisma.service";
import { UsersService } from "@/resources/users/users.service";
import { Injectable } from "@nestjs/common";

import { SigninDto, SignupDto, SignupSchema } from "./dto/signin.dto";
import { TokenDto } from "./dto/token.dto";
import { GoogleUserResponseDto } from "./google/google.types";
import { JwtTokenService } from "./jwt-token/jwt-token.service";
import { PasswordService } from "./password.service";
import { RefreshTokenService } from "./refresh-token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly passwordService: PasswordService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersService: UsersService
  ) {}

  async validateJwtUser(id: string) {
    const user = await this.usersService.findOne(id);

    return user;
  }

  async validateGoogleUser(userData: GoogleUserResponseDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      const newUser = await this.usersService.createUser({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: "",
      });

      return newUser;
    }

    if (user.password) {
      await this.usersService.updateUser(user.id, {
        password: "",
      });
    }

    return user;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if (!user?.refreshToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const isRefreshTokenValid =
      await this.refreshTokenService.compareRefreshToken(
        refreshToken,
        user.refreshToken
      );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return user;
  }

  async signin(dto: SigninDto): Promise<TokenDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      dto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);

    const hashedRefreshToken =
      await this.refreshTokenService.hashRefreshToken(refreshToken);

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(dto: SignupDto): Promise<TokenDto> {
    const parsedData = SignupSchema.safeParse(dto);

    if (!parsedData.success) {
      throw new BadRequestException(
        parsedData.error.issues[0]?.message ?? "Validation failed"
      );
    }

    const parsedDto = parsedData.data;

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: parsedDto.email,
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new NotFoundException("User with this email already exists");
    }

    const hashedPassword = await this.passwordService.hashPassword(
      dto.password
    );

    const user = await this.usersService.createUser({
      email: parsedDto.email,
      firstName: parsedDto.firstName,
      lastName: parsedDto.lastName,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = this.generateTokens(user.id);

    const hashedRefreshToken =
      await this.refreshTokenService.hashRefreshToken(refreshToken);

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async googleLogin(userId: string): Promise<TokenDto> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);

    const hashedRefreshToken =
      await this.refreshTokenService.hashRefreshToken(refreshToken);

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string): Promise<TokenDto> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);

    const hashedRefreshToken =
      await this.refreshTokenService.hashRefreshToken(refreshToken);

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logOut(userId: string): Promise<void> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    await this.usersService.updateRefreshToken(user.id, null);
  }

  private generateTokens(userId: string): TokenDto {
    const accessToken = this.jwtTokenService.generateAccessToken(userId);
    const refreshToken = this.jwtTokenService.generateRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  }
}
