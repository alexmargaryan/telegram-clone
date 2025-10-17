/* eslint-disable @typescript-eslint/no-explicit-any */
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  USER_PROFILE: (id: string) => `/dashboard/user/${id}`,
} as const satisfies Record<
  string,
  string | ((...args: any[]) => `${string}/${string}`)
>;
