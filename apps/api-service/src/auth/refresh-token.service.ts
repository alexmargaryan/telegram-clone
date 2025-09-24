import * as argon2 from "argon2";

import { Injectable } from "@nestjs/common";

@Injectable()
export class RefreshTokenService {
  async compareRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string
  ): Promise<boolean> {
    return argon2.verify(hashedRefreshToken, refreshToken);
  }

  async hashRefreshToken(refreshToken: string): Promise<string> {
    return argon2.hash(refreshToken);
  }
}
