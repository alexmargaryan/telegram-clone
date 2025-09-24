import { Response } from "express";

import { ApiConfigService } from "@/config/config.service";
import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import { SigninDto, SignupDto } from "./dto/signin.dto";
import { TokenDto } from "./dto/token.dto";
import { GoogleAuthGuard } from "./google/google-auth.guard";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { RefreshJwtAuthGuard } from "./jwt/refresh-jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiConfigService: ApiConfigService
  ) {}

  @Public()
  @Post("signin")
  @ApiOkResponse({ type: TokenDto })
  async signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Public()
  @Post("signup")
  @ApiOkResponse({ type: TokenDto })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
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
  @ApiOkResponse({ type: TokenDto })
  async refreshToken(@CurrentUser("id") userId: string) {
    return this.authService.refreshToken(userId);
  }

  @ApiBearerAuth()
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async logout(@CurrentUser("id") userId: string) {
    return this.authService.logOut(userId);
  }
}
