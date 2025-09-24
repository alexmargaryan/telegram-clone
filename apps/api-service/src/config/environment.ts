import { z } from "zod";

export enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}

const environmentValidationSchema = z.object({
  PORT: z.coerce.number().default(5000),
  API_URL: z.string().url().default("http://localhost:5000"),
  WEB_CLIENT_URL: z.string().url().default("http://localhost:5173"),
  NODE_ENV: z
    .enum([Environment.Development, Environment.Test, Environment.Production])
    .default(Environment.Development),

  JWT_PUBLIC_KEY: z.string().default(""),
  JWT_PRIVATE_KEY: z.string().default(""),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_JWT_PUBLIC_KEY: z.string().default(""),
  REFRESH_JWT_PRIVATE_KEY: z.string().default(""),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),

  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GOOGLE_CALLBACK_URL: z.string().default(""),
});

export const config = (config: Record<string, unknown>) => {
  const result = environmentValidationSchema.parse(config);
  return result;
};
