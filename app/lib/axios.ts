import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { redirect } from "react-router";

const url = import.meta.env.VITE_API_URL;
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (value?: unknown) => {
              const token = value as string;
              originalRequest.headers = originalRequest.headers ?? {};
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.get<{ access_token: string }>(
          `${url}/refresh`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          },
        );
        const newAccessToken = refreshResponse.data.access_token;

        Cookies.set("token", newAccessToken, { expires: 7 });
        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        Cookies.set("token", "unauthorized");
        if (typeof window !== "undefined") {
          return redirect("/login");
          // window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
