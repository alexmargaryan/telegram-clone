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

  async refreshToken(): Promise<{ status: "success" } | { status: "failed" }> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve: () => resolve({ status: "success" }),
          reject: () => reject({ status: "failed" }),
        });
      });
    }

    this.isRefreshing = true;

    try {
      await refreshTokens();
      return { status: "success" };
    } catch (error) {
      this.processQueue(
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      this.isRefreshing = false;
    }

    return { status: "failed" };
  }
}

export const refreshTokenService = new RefreshTokenService();
