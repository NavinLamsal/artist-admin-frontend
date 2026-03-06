import type { IFormInput } from '@/pages/songs/songForm';
import * as yup from 'yup';

export const GENRES = ["rnb", "country", "classic", "rock", "jazz"] as const;

export type Genre = (typeof GENRES)[number];

export const MusicSchema = yup.object().shape({
    id: yup.number().required('Music ID is required'),
    title: yup.string().required('Music title is required'),
    album_name: yup.string().required('Album name is required'),
    genre: yup
          .mixed<Genre>()
          .oneOf(GENRES, "Invalid genre")
          .required("Genre is required"),
      });





export const BulkMusicSchema: yup.ObjectSchema<IFormInput> = yup.object({
  musics: yup
    .array()
    .of(
      yup.object({
        title: yup.string().trim().required("Music title is required"),
        album_name: yup.string().trim().required("Album name is required"),
        genre: yup
          .mixed<Genre>()
          .oneOf(GENRES)
          .required("Genre is required"),
      })
    )
    .min(1, "At least one music entry is required")
    .required(),
});