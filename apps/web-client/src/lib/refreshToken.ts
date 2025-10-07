import axios from "axios";

import { baseURL } from "@/constants/common";

async function refreshTokens(): Promise<void> {
  return axios.post(`${baseURL}/api/auth/refresh`, undefined, {
    withCredentials: true,
  });
}

class RefreshTokenService {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
  }> = [];

  private processQueue(error: Error | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  async refreshToken(): Promise<void> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      await refreshTokens();
    } catch (error) {
      this.processQueue(
        error instanceof Error ? error : new Error(String(error))
      );

      // Redirect to login page or handle authentication failure
      if (typeof window !== "undefined") {
        // window.location.href = "/signin";
      }
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const refreshTokenService = new RefreshTokenService();
