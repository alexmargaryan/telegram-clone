import { baseURL } from "@/constants/common";

/**
 * Logs out the user by making a request to the backend and also additionally
 * clearing the auth cookies from the browser using a route handler in case the
 * backend request fails.
 */
export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(`${baseURL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await fetch("/api/logout");
  }
};
