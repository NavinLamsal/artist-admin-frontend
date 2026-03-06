import type { Artist } from "@/types/artist";
import api from "./APIRequest";
import { handleError, type Pagination } from "./userService";

export interface ListArtistParams {
  page?: number;
  per_page?: number;
  search?: string;
}


export interface ListArtistsResponse {
    data:{
        artists: Artist[];
        pagination: Pagination;
    }
    success: boolean;
    message: string;
    error?: string;
  
}

export interface DefaultResponse{
    data: any;
    success: boolean;
    message: string;
    error?: string;
}


export interface ArtistResponse{
    data: {artist: Artist} 
    success: boolean;
    message: string;
    error?: string;
}


export const listArtists = async (
  params?: ListArtistParams
): Promise<ListArtistsResponse> => {
  try {
    const response = await api.get<ListArtistsResponse>("/artists", { params });
    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};




export const createArtist = async ( body: Partial<Artist>) => {
    try {
        const response = await api.post<Artist>("/artists", body);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
    }
};


export const updateArtist = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
    try {
        const response = await api.put<Artist>(`/artists/${id}`, data);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
    }
};


export const getArtistDetails = async (
  id: string
): Promise<ArtistResponse> => {
  try {
    const response = await api.get<ArtistResponse>(`/artists/${id}`);
    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};

export const getArtistDetailsByUserId = async (
  id: number
): Promise<ArtistResponse> => {
  try {
    const response = await api.get<ArtistResponse>(`/artists/${id}/by_user`);
    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};

export const deleteArtist = async (id: number) => {
    try {
        const response = await api.delete(`/artists/${id}`);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
    }
};

export const exportArtists = async() => {
    try {
        const response = await api.get(`/artists/export`);
        return response.data;
    } catch (error: any) {
        handleError(error);
    }
}

