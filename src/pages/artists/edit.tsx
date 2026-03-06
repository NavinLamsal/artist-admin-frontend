import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { getArtistDetails, updateArtist } from "@/services/artistService";
import { ArtistEditSchema } from "@/lib/validators/artist-validators";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "@/components/Skeleton";

interface IFormInput {
  name: string;
  dob: Date | null;
  gender: "m" | "f" | "o";
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
}

const EditArtist: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<IFormInput>({
    resolver: yupResolver(ArtistEditSchema),
    defaultValues: {
      name: "",
      dob: null,
      gender: "m",
      address: "",
      first_release_year: 2000,
      no_of_albums_released: 0,
    },
  });

  /*
  -------------------------
  FETCH ARTIST DETAILS
  -------------------------
  */

  const { data, isLoading, error } = useQuery({
    queryKey: ["artist-details", id],
    queryFn: async () => {
      if (!id) throw new Error("Artist ID missing");
      return getArtistDetails(id);
    },
    enabled: !!id,
  });

  const artist = data?.data?.artist;

  /*
  -------------------------
  RESET FORM WHEN DATA ARRIVES
  -------------------------
  */

  useEffect(() => {
    if (!artist) return;

    reset({
      name: artist.name,
      dob: artist.dob ? new Date(artist.dob) : null,
      gender: artist.gender,
      address: artist.address,
      first_release_year: artist.first_release_year,
      no_of_albums_released: artist.no_of_albums_released,
    });
  }, [artist, reset]);

 

  const mutation = useMutation({
    mutationFn: updateArtist,
    onSuccess: () => {
      toast.success("Artist updated successfully 🎵");
      navigate("/artists");
    },
    onError: ({ response }: any) => {
      if (response?.status === 400) {
        const serverErrors = response?.data || {};

        Object.entries(serverErrors).forEach(([key, message]) => {
          setError(key as keyof IFormInput, {
            type: "manual",
            message: message as string,
          });
        });
      } else {
        toast.error("Artist update failed. Please try again.");
      }
    },
  });


  const onSubmit: SubmitHandler<IFormInput> = (formData) => {
    if (!id) return;

    mutation.mutate({
      id,
      data: {
      name: formData.name,
      dob: formData.dob ? new Date(formData.dob) : null,
      gender: formData.gender,
      address: formData.address,
      first_release_year: formData.first_release_year,
      no_of_albums_released: formData.no_of_albums_released,
    }
    });
  };


  if (isLoading) {
    return (
      <div className="p-6">
        Loading artist...
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load artist</div>;
  }

  if (!artist) {
    return <div className="p-6">Artist not found</div>;
  }

 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-gray-700">
          Edit Artist
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* NAME */}
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input
                {...register("name")}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Date of Birth
              </label>

              <input
                type="date"
                {...register("dob", { valueAsDate: true })}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {errors.dob && (
                <p className="text-sm text-red-500">{errors.dob.message}</p>
              )}
            </div>

         
            <div>
              <label className="block mb-1 text-sm font-medium">Gender</label>

              <div className="flex gap-4">

                <label className="flex items-center gap-2">
                  <input type="radio" value="m" {...register("gender")} />
                  Male
                </label>

                <label className="flex items-center gap-2">
                  <input type="radio" value="f" {...register("gender")} />
                  Female
                </label>

                <label className="flex items-center gap-2">
                  <input type="radio" value="o" {...register("gender")} />
                  Other
                </label>

              </div>

              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block mb-1 text-sm font-medium">Address</label>

              <input
                {...register("address")}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* FIRST RELEASE YEAR */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                First Release Year
              </label>

              <input
                type="number"
                {...register("first_release_year")}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {errors.first_release_year && (
                <p className="text-sm text-red-500">
                  {errors.first_release_year.message}
                </p>
              )}
            </div>

            {/* NUMBER OF ALBUMS */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Number of Albums Released
              </label>

              <input
                type="number"
                {...register("no_of_albums_released")}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {errors.no_of_albums_released && (
                <p className="text-sm text-red-500">
                  {errors.no_of_albums_released.message}
                </p>
              )}
            </div>

          </div>

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {mutation.isPending ? "Updating..." : "Update Artist"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditArtist;