import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GENRES, MusicSchema, type Genre } from "@/lib/validators/music-validators";
import { UpdateSongs } from "@/services/songService";


export interface ISongEditInput {
  id: number;
  title: string;
  album_name: string;
  genre: Genre;
}

interface SongEditFormProps {
  defaultValue: ISongEditInput;

}

const SongEditForm: React.FC<SongEditFormProps> = ({ defaultValue }) => {
  const navigate = useNavigate();

  const { register, handleSubmit,  formState: { errors } } = useForm<ISongEditInput>({
    resolver: yupResolver(MusicSchema), 
    defaultValues: defaultValue,
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: UpdateSongs,
    onSuccess: () => {
      toast.success("Song updated successfully 🎵");
     queryClient.invalidateQueries({ queryKey: ["songs"] });
      navigate("/songs");
    },
    onError: () => {
      toast.error("Failed to update song");
    },
  });

  const onSubmit = (data: ISongEditInput) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-xl font-semibold">Edit Song</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="block mb-1">Title</label>
            <input
              {...register("title")}
              placeholder="Song title"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Album Name</label>
            <input
              {...register("album_name")}
              placeholder="Album name"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.album_name && <p className="text-sm text-red-500">{errors.album_name.message}</p>}
          </div>

          <div>
            <label className="block mb-1">Genre</label>
            <select
              {...register("genre")}
              className="w-full px-3 py-2 border rounded-md"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>{genre.toUpperCase()}</option>
              ))}
            </select>
            {errors.genre && <p className="text-sm text-red-500">{errors.genre.message}</p>}
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {mutation.isPending ? "Updating..." : "Update Song"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongEditForm;