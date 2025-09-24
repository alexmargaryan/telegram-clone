import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

import { ApiConfigService } from "@/config/config.service";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: apiConfigService.googleClientId,
      clientSecret: apiConfigService.googleClientSecret,
      callbackURL: apiConfigService.googleCallbackUrl,
      scope: ["email", "profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) {
    if (
      profile.emails?.length &&
      profile.emails[0]?.value &&
      profile.name?.givenName &&
      profile.name?.familyName
    ) {
      const user = await this.authService.validateGoogleUser({
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
      });

      done(null, user);
    }

    done(null, false);
  }
}
