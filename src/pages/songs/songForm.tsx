import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, Trash } from "lucide-react";
import {
  BulkMusicSchema,
  GENRES,
  type Genre,
} from "@/lib/validators/music-validators";

import { createSongs } from "@/services/songService";

export interface IMusicInput {
  title: string;
  album_name: string;
  genre: Genre;
}

export interface IFormInput {
  musics: IMusicInput[];
}

interface SongFormProps {
  artist_id: string;
}

const SongForm: React.FC<SongFormProps> = ({ artist_id }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(BulkMusicSchema),
    defaultValues: {
      musics: [{ title: "", album_name: "", genre: "rnb" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "musics",
  });

  const mutation = useMutation({
    mutationFn: createSongs,

    onSuccess: () => {
      toast.success("Songs created successfully 🎵");
      reset();
      navigate("/songs");
    },

    onError: () => {
      toast.error("Failed to create songs");
    },
  });

  const onSubmit = (data: IFormInput) => {
    mutation.mutate({
      artist_id,
      musics: data.musics,
    });
  };

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">

        <h2 className="mb-6 text-xl font-semibold">Add Songs</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Musics</h3>

            <button
              type="button"
              onClick={() =>
                append({ title: "", album_name: "", genre: "rnb" })
              }
              className="text-indigo-600 hover:text-indigo-800"
            >
              <PlusCircleIcon size={18} />
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-4 items-start"
            >

          
              <div className="col-span-4">
                <input
                  {...register(`musics.${index}.title`)}
                  placeholder="Title"
                  className="w-full px-3 py-2 border rounded-md"
                />

                {errors.musics?.[index]?.title && (
                  <p className="text-sm text-red-500">
                    {errors.musics[index]?.title?.message}
                  </p>
                )}
              </div>

             
              <div className="col-span-3">
                <input
                  {...register(`musics.${index}.album_name`)}
                  placeholder="Album name"
                  className="w-full px-3 py-2 border rounded-md"
                />

                {errors.musics?.[index]?.album_name && (
                  <p className="text-sm text-red-500">
                    {errors.musics[index]?.album_name?.message}
                  </p>
                )}
              </div>

              
              <div className="col-span-3">
                <select
                  {...register(`musics.${index}.genre`)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre.toUpperCase()}
                    </option>
                  ))}
                </select>

                {errors.musics?.[index]?.genre && (
                  <p className="text-sm text-red-500">
                    {errors.musics[index]?.genre?.message}
                  </p>
                )}
              </div>

           
              <div className="flex items-center col-span-2">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash size={18} />
                </button>
              </div>

            </div>
          ))}

          <div className="text-right">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {mutation.isPending ? "Submitting..." : "Add Songs"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SongForm;