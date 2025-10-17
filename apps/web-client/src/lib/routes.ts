/* eslint-disable @typescript-eslint/no-explicit-any */
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  CHATS: "/chats",
  CHAT: (chatId: string) => `/chats/${chatId}`,
} as const satisfies Record<
  string,
  string | ((...args: any[]) => `${string}/${string}`)
>;
