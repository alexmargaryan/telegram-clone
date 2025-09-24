import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Environment } from "./environment";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>("PORT")!;
  }

  get apiUrl(): string {
    return this.configService.get<string>("API_URL")!;
  }

  get webClientUrl(): string {
    return this.configService.get<string>("WEB_CLIENT_URL")!;
  }

  get isDevelopment(): boolean {
    return (
      this.configService.get<string>("NODE_ENV") === Environment.Development
    );
  }

  get isTesting(): boolean {
    return this.configService.get<string>("NODE_ENV") === Environment.Test;
  }

  get isProduction(): boolean {
    return (
      this.configService.get<string>("NODE_ENV") === Environment.Production
    );
  }

  get jwtPublicKey(): string {
    return this.configService
      .get<string>("JWT_PUBLIC_KEY")!
      .replaceAll("\\n", "\n");
  }

  get jwtPrivateKey(): string {
    return this.configService
      .get<string>("JWT_PRIVATE_KEY")!
      .replaceAll("\\n", "\n");
  }

  get accessTokenExpiresIn(): string {
    return this.configService.get<string>("ACCESS_TOKEN_EXPIRES_IN")!;
  }

  get refreshJwtPublicKey(): string {
    return this.configService
      .get<string>("REFRESH_JWT_PUBLIC_KEY")!
      .replaceAll("\\n", "\n");
  }

  get refreshJwtPrivateKey(): string {
    return this.configService
      .get<string>("REFRESH_JWT_PRIVATE_KEY")!
      .replaceAll("\\n", "\n");
  }

  get refreshTokenExpiresIn(): string {
    return this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN")!;
  }

  get googleClientId(): string {
    return this.configService.get<string>("GOOGLE_CLIENT_ID")!;
  }

  get googleClientSecret(): string {
    return this.configService.get<string>("GOOGLE_CLIENT_SECRET")!;
  }

  get googleCallbackUrl(): string {
    return this.configService.get<string>("GOOGLE_CALLBACK_URL")!;
  }
}
