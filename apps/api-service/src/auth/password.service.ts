import { compare, hash } from "bcrypt";
import * as crypto from "crypto";

import { Injectable } from "@nestjs/common";

export const charsets = {
  NUMBERS: "0123456789",
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  SYMBOLS: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
};

@Injectable()
export class PasswordService {
  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  generateRandomPassword(length = 12, isNumeric = false): string {
    let password = "";

    const charset = isNumeric
      ? charsets.NUMBERS
      : charsets.LOWERCASE +
        charsets.SYMBOLS +
        charsets.NUMBERS +
        charsets.UPPERCASE;

    while (length--) {
      password += charset[crypto.randomInt(charset.length)];
    }

    return password;
  }
}
