import { Response, Request } from "express";

import { ApiConfigService } from "@/config/config.service";
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import { SigninDto, SignupDto } from "./dto/signin.dto";
import { GoogleAuthGuard } from "./google/google-auth.guard";
import { JwtTokenService } from "./jwt-token/jwt-token.service";
import { RefreshJwtAuthGuard } from "./jwt/refresh-jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiConfigService: ApiConfigService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  @Public()
  @Post("signin")
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.signin(dto);

    // TODO: create and use a function for setting a maxAge
    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 1000, // 1 minute
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
    });
  }

  @Public()
  @Post("signup")
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.signup(dto);

    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 1000, // 1 minute
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
    });
  }

  @Public()
  @Get("google/login")
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  /**
   * This route is called after the user has authenticated with Google.
   * In google cloud we set the redirect URI to /api/auth/google/redirect
   */
  @Public()
  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  @ApiOkResponse()
  async googleCallback(
    @CurrentUser("id") userId: string,
    @Res() res: Response
  ) {
    const response = await this.authService.googleLogin(userId);

    res.redirect(
      `${this.apiConfigService.webClientUrl}?token=${response.accessToken}&refreshToken=${response.refreshToken}`
    );
  }

  @Public()
  @Post("refresh")
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(
    @CurrentUser("id") userId: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(userId);

    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 1000, // 1 minute
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
    });
  }

  @Post("logout")
  @ApiOkResponse()
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");

    const refreshToken = request.cookies["refreshToken"] as string | undefined;

    if (refreshToken) {
      const decoded = this.jwtTokenService.decodeToken(refreshToken);
      const userId = decoded.sub;
      console.log("decoded ---->", decoded);
      await this.authService.logOut(userId);
    }

    return { message: "Logged out successfully" };
  }
}
