
export interface Artist {
    id: number
    name: string
    dob?: string
    gender: 'm' | 'f' | 'o';
    address?: string
    first_release_year: number
    no_of_albums_released: number
    music_count: number
    created_at: string
    updated_at: string
    music: Music[]
}

export interface Music{
    id:number
    artist_id?:number
    title:string
    album_name:string
    genre:string
}

export interface MusicCreate{
    artist_id:string
    musics: Song[]
}
export interface Song{
    title:string
    album_name:string
    genre:string
}