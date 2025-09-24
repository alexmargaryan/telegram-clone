import { ApiConfigService } from "src/config/config.service";

import { Injectable } from "@nestjs/common";
import { JwtOptionsFactory, JwtModuleOptions } from "@nestjs/jwt";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly apiConfigService: ApiConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      privateKey: this.apiConfigService.jwtPrivateKey,
      publicKey: this.apiConfigService.jwtPublicKey,
      signOptions: {
        algorithm: "ES512",
      },
    };
  }
}
