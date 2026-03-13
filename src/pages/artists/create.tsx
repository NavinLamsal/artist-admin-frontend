import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArtistSchema } from "@/lib/validators/artist-validators";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, Trash } from "lucide-react";
import { createArtist } from "@/services/artistService";
import BackButton from "@/components/BackNavigation";
import PagesLayout from "@/layouts/pagesLayout";
import { Button } from "@/components/ui/button";

interface IMusicInput {
    title: string;
    album_name: string;
    genre: "rnb" | "country" | "classic" | "rock" | "jazz";
}

interface IFormInput {
    name: string;
    dob: Date | null;
    gender: "m" | "f" | "o";
    address: string;
    first_release_year: number;
    no_of_albums_released: number;
    musics?: IMusicInput[];
}

const CreateArtist: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        control,
        getValues,
    } = useForm<IFormInput>({
        resolver: yupResolver(ArtistSchema),
        defaultValues: {
            name: "",
            dob: null,
            gender: "m",
            address: "",
            no_of_albums_released: 0,
            first_release_year: 2000,
            musics: [{ title: "", album_name: "", genre: "rnb" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "musics",
    });

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: createArtist,
        onSuccess: () => {
            toast.success("Artist Created Successfully!");
            reset();
            navigate("/artist/list");
        },
        onError: (error: any) => {
            if (error?.status === 400) {
                const serverErrors = error?.data || {};
                for (const [key, message] of Object.entries(serverErrors)) {
                    if (Object.keys(getValues()).includes(key)) {
                        setError(key as keyof IFormInput, {
                            type: "manual",
                            message: message as string,
                        });
                    }
                }
            } else {
                toast.error("Artist creation failed. Please try again.");
            }
        },
    });

    const onSubmit = (data: IFormInput) => {
        const formattedData = {
            ...data,
            dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : null,
        };
        mutation.mutate(formattedData);
    };

    return (
        <PagesLayout title="Create Artist" actions={<BackButton />}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Name</label>
                        <input
                            {...register("name")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Date of Birth</label>
                        <input
                            type="date"
                            {...register("dob")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                        />
                        {errors.dob && (
                            <p className="text-sm text-red-500">{errors.dob.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Gender</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="m"
                                    {...register("gender")}
                                    className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium">Male</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="f"
                                    {...register("gender")}
                                    className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium">Female</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="o"
                                    {...register("gender")}
                                    className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium">Other</span>
                            </label>
                        </div>
                        {errors.gender && (
                            <p className="text-sm text-red-500">{errors.gender.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Address</label>
                        <input
                            {...register("address")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">First Release Year</label>
                        <input
                            type="number"
                            {...register("first_release_year")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                        />
                        {errors.first_release_year && (
                            <p className="text-sm text-red-500">{errors.first_release_year.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Number of Albums Released</label>
                        <input
                            type="number"
                            {...register("no_of_albums_released")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                        />
                        {errors.no_of_albums_released && (
                            <p className="text-sm text-red-500">{errors.no_of_albums_released.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Musics</h2>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-4 mb-4">
                        <div className="col-span-4">
                            <input
                                {...register(`musics.${index}.title`)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                                placeholder="Title"
                            />
                            {errors.musics?.[index]?.title && (
                                <p className="text-sm text-red-500">{errors.musics[index]?.title?.message}</p>
                            )}
                        </div>
                        <div className="col-span-3">
                            <input
                                {...register(`musics.${index}.album_name`)}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                                placeholder="Album Name"
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
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            >
                                <option value="rnb">R&B</option>
                                <option value="country">Country</option>
                                <option value="classic">Classic</option>
                                <option value="rock">Rock</option>
                                <option value="jazz">Jazz</option>
                            </select>
                            {errors.musics?.[index]?.genre && (
                                <p className="text-sm text-red-500">{errors.musics[index]?.genre?.message}</p>
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

                <div className="text-right">
                    <button
                        type="submit"
                        className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Submitting" : "Create Artist"}
                    </button>
                </div>
            </form>
        </PagesLayout>

    );
};

export default CreateArtist;

