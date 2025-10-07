import axios, { AxiosRequestConfig, AxiosError } from "axios";

import { authControllerLogout } from "@/api/generated/queries";
import { ApiError } from "@/api/types";
import { baseURL } from "@/constants/common";
import { refreshTokenService } from "@/lib/refreshToken";

const axios_instance = axios.create({
  baseURL,
  withCredentials: true,
});

axios_instance.interceptors.request.use(
  async (config) => {
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json; charset=utf-8";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios_instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401) {
      // Check if the error is due to token expiration (401 Unauthorized)

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await refreshTokenService.refreshToken();

          // Retry the original request with the new token
          return axios_instance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout and redirect to signin screen

          try {
            await authControllerLogout();
          } catch (error) {
            console.error(error);
          } finally {
            if (typeof window !== "undefined") {
              window.location.href = "/signin";
            }
          }

          return Promise.reject(refreshError);
        }
      }
    }

    // For other errors or if refresh fails, reject the promise
    return Promise.reject(error);
  }
);

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axios_instance({ ...config, cancelToken: source.token }).then(
    ({ data }) => data
  );

  return promise;
};
