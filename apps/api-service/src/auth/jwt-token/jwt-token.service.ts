import { ApiConfigService } from "@/config/config.service";
import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import { JwtPayload, JwtTokenType } from "./jwt-token.types";

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly jwtService: JwtService
  ) {}

  public generateAccessToken(userId: string) {
    const tokenPayload: JwtPayload = {
      sub: userId,
      type: JwtTokenType.Access,
    };

    // We don't need to pass the private key here
    // because we have a separate config for that
    const options: JwtSignOptions = {
      expiresIn: this.configService.accessTokenExpiresIn,
      algorithm: "ES512",
    };

    return this.generateToken(tokenPayload, options);
  }

  public generateRefreshToken(userId: string) {
    const tokenPayload: JwtPayload = {
      sub: userId,
      type: JwtTokenType.Refresh,
    };

    const options: JwtSignOptions = {
      expiresIn: this.configService.refreshTokenExpiresIn,
      privateKey: this.configService.refreshJwtPrivateKey,
      algorithm: "ES512",
    };

    return this.generateToken(tokenPayload, options);
  }

  private generateToken(payload: Record<string, any>, options: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }
}
