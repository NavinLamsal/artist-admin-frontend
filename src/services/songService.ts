import type { Music, MusicCreate } from "@/types/artist";
import api from "./APIRequest";
import { handleError, type Pagination } from "./userService";

export interface ListSongsParams {
  page?: number;
  per_page?: number;
  search?: string;
}


export interface ListSongsResponse {
    data:{
        songs: Music[];
        pagination: Pagination;
    }
    success: boolean;
    message: string;
    error?: string;

}

export interface SongResponse{
    data: {song: Music} 
    success: boolean;
    message: string;
    error?: string;
}



export const listSongs = async (
  params?: ListSongsParams
): Promise<ListSongsResponse> => {
  try {
    const response = await api.get<ListSongsResponse>("/songs", { params });
    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};


export const deleteSong = async (id: number) => {
    try {
        const response = await api.delete(`/songs/${id}`);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
    }
};


export const createSongs = async ( body: MusicCreate) => {
    try {
        const response = await api.post<MusicCreate>("/songs", body);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
    }
};


export const getSongDetails = async (
  id: number
): Promise<SongResponse> => {
  try {
    const response = await api.get<SongResponse>(`/songs/${id}`);
    return response.data;
  } catch (error: unknown) {
    return handleError(error); 
  }
};

export const UpdateSongs = async ( body: Music): Promise<any> => {
    console.log(body);
    try {
        const response = await api.put<MusicCreate>(`/songs/${body.id}`, body);
        return response.data;
    } catch (error: unknown) {
        handleError(error);
    }
};