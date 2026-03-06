import api from "./APIRequest";
import type { User } from "@/types/User";
import type { AxiosError } from "axios";



export interface ListUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

export interface ListUsersResponse {
    data:{
        users: User[];
        pagination: Pagination;
    }
    success: boolean;
    message: string;
    error?: string;
  
}

export interface UsersResponse{
    data: {user: User} 
    success: boolean;
    message: string;
    error?: string;
}



export const handleError = (error: unknown): never => {
  const axiosError = error as AxiosError;
  throw axiosError?.response?.data || axiosError;
};


export const listUsers = async (
  params?: ListUsersParams
): Promise<ListUsersResponse> => {
  try {
    const response = await api.get<ListUsersResponse>("/users", { params });
    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};

export const createUser = async (
  body: Partial<User> & { confirmPassword?: string }
): Promise<User> => {
    
  try {
     
     const { confirmPassword, ...payload } = body;

    
    const formattedPayload = {
      ...payload,
      dob: payload.dob ? new Date(payload.dob).toISOString().split("T")[0] : undefined,
    };

    const response = await api.post<User>("/users", formattedPayload);
    return response.data;
  } catch (error: unknown) {
    return handleError(error); // ✅ FIXED
  }
};

export const updateUser = async (
  id: number,
  body: Partial<User>
): Promise<User> => {
  try {
    const formattedData = {
      ...body,
      dob: body.dob
        ? new Date(body.dob).toISOString().split("T")[0]
        : null,
    };

    const response = await api.put<User>(
      `/users/${id}`,
      formattedData
    );

    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};

export const getUserDetails = async (
  id: number
): Promise<UsersResponse> => {
  try {
    const response = await api.get<UsersResponse>(`/users/${id}`);
    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};

export const deleteUser = async (
  id: number
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(
      `/users/${id}`
    );
    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};