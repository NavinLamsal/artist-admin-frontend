import React, { useEffect } from "react";
import {
    useForm,
} from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserDetails, updateUser, type UsersResponse } from "@/services/userService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditUserSchema } from "@/lib/validators/user-edit-validators";
import type { User } from "@/types/User";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackNavigation";
import Skeleton from "@/components/Skeleton";
import PagesLayout from "@/layouts/pagesLayout";

interface IFormInput {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    dob?: string;
    gender: "m" | "f" | "o";
    address: string;
    role: "super_admin" | "artist_manager" | "artist";
}

interface ApiValidationError {
    status?: number;
    data?: Record<string, string>;
    message?: string;
}

const EditUser: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm<IFormInput>({
        resolver: yupResolver(EditUserSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            dob: undefined,
            gender: "m",
            address: "",
            role: "artist",
        },
    });

    const {
        data: userData,
        isLoading,
        error,
    } = useQuery<UsersResponse, Error>({
        queryKey: ["user", id],
        queryFn: async () => {
            if (!id) throw new Error("No ID provided");
            return getUserDetails(Number(id));
        },
        enabled: !!id,
    });


    useEffect(() => {
        if (userData) {

            const { id, created_at, updated_at, ...users } = userData.data.user
            reset({
                ...users,
                dob: users.dob
                    ? new Date(users.dob).toISOString().split("T")[0]
                    : "",
            });
        }
    }, [userData, reset]);

    const mutation = useMutation<
        User,
        Error,
        { id: number; data: Partial<User> }
    >({
        mutationFn: ({ id, data }) => updateUser(id, data),

        onSuccess: () => {
            toast.success("User Updated Successfully!");
            navigate("/users");
        },

        onError: (error: unknown) => {
            const err = error as ApiValidationError;

            if (err?.status === 400 && err?.data) {
                Object.entries(err.data).forEach(([key, message]) => {
                    setError(key as keyof IFormInput, {
                        type: "server",
                        message,
                    });
                });
            } else {
                toast.error(err?.message || "Update failed. Please try again.");
            }
        },
    });

    const onSubmit = (data: IFormInput) => {
        if (!id) return;

        mutation.mutate({
            id: Number(id),
            data: data,
        });
    };


    if (isLoading) return <div><Skeleton /></div>;
    if (error) return <div>Error loading user details.</div>;


    return (
        <PagesLayout
            title="Edit User"
            actions={
                <BackButton />
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            First Name
                        </label>
                        <input
                            {...register("first_name")}
                            className="w-full px-4 py-2 text-sm border rounded-lg"
                        />
                        {errors.first_name && (
                            <p className="text-sm text-red-500">
                                {errors.first_name.message}
                            </p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Last Name
                        </label>
                        <input
                            {...register("last_name")}
                            className="w-full px-4 py-2 text-sm border rounded-lg"
                        />
                        {errors.last_name && (
                            <p className="text-sm text-red-500">
                                {errors.last_name.message}
                            </p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Email
                        </label>
                        <input
                            readOnly
                            type="email"
                            {...register("email")}
                            className="w-full px-4 py-2 text-sm border rounded-lg bg-gray-100"
                        />
                    </div>


                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            {...register("dob")}
                            className="w-full px-4 py-2 text-sm border rounded-lg"
                        />
                        {errors.dob && (
                            <p className="text-sm text-red-500">
                                {errors.dob.message}
                            </p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Gender
                        </label>
                        <div className="flex space-x-4">
                            {["m", "f", "o"].map((g) => (
                                <label key={g} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value={g}
                                        {...register("gender")}
                                    />
                                    <span>
                                        {g === "m"
                                            ? "Male"
                                            : g === "f"
                                                ? "Female"
                                                : "Other"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>


                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Address
                        </label>
                        <input
                            {...register("address")}
                            className="w-full px-4 py-2 text-sm border rounded-lg"
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">
                                {errors.address.message}
                            </p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Role
                        </label>
                        <select
                            {...register("role")}
                            className="w-full px-4 py-2 text-sm border rounded-lg"
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="artist_manager">Artist Manager</option>
                            <option value="artist">Artist</option>
                        </select>
                    </div>
                </div>

                <div className="text-right">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className=""
                    >
                        {mutation.isPending
                            ? "Updating..."
                            : "Update User"}
                    </Button>
                </div>
            </form>
        </PagesLayout>

    );
};

export default EditUser;