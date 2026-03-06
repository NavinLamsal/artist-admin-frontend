import { AxiosError } from "axios";
import api from "./APIRequest";
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from "@/types/auth";



export const registerUser = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      data
    );

    return response.data;

  } catch (error: unknown) {

    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Registration failed");
  }
};


export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {

  try {
    const response = await api.post<AuthResponse>(
      "/auth/login",
      data
    );

    if (response.data.success) {
      sessionStorage.setItem(
        "access_token",
        response.data.data.access_token
      );

      sessionStorage.setItem(
        "refresh_token",
        response.data.data.refresh_token
      );
    }

    return response.data;

  } catch (error: unknown) {

    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Login failed");
  }
};



export const logout = (): void => {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
};


export const getUsers = async (): Promise<UserResponse> => {
  const response = await api.get<UserResponse>("/auth/me");
  return response.data;
};