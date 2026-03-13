import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, Sidebar, Trash } from "lucide-react";
import {
  BulkMusicSchema,
  GENRES,
  type Genre,
} from "@/lib/validators/music-validators";

import { createSongs } from "@/services/songService";
import { Button } from "@/components/ui/button";

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
  showheader?: boolean
}

const SongForm: React.FC<SongFormProps> = ({ artist_id, showheader=false }) => {
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
    <div className="flex items-center justify-start">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {showheader &&
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-medium">Musics</h3>

            
          </div>}

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

           
              <div className="flex items-center justify-end col-span-2 gap-2">
                {fields.length > 1 && 
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant={"destructive"}
                  size={"icon-sm"}
                >
                  <Trash size={18} />
                </Button>
                }
                {index === fields.length - 1 &&
                
                <Button
              type="button"
              onClick={() =>
                append({ title: "", album_name: "", genre: "rnb" })
              }
              size={"icon-sm"}
              className="bg-green-600 hover:bg-green-800"
            >
              <PlusCircleIcon size={18} />
            </Button>
                }
              </div>
            </div>
          ))}


          <div className="flex items-center justify-end gap-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              
            >
              {mutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SongForm;