import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser } from "@/services/authService";
import { registerSchema } from "@/lib/validators/register-validators";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

interface IFormInput {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob: Date | null;
    gender: "m" | "f" | "o";
    address: string;
}

const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        getValues,
        reset
    } = useForm<IFormInput>({
        resolver: yupResolver(registerSchema),
    });

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success("User Registered Successfully!");
            reset();
            navigate('/login');
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
                toast.error("Registration failed. Please try again.");
            }
        }
    });

    const onSubmit = (data: IFormInput) => {
        const formattedData = {
            ...data,
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : null,
        };
        mutation.mutate(formattedData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">First Name</label>
                        <input
                            {...register("first_name")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-secondary"
                        />
                        {errors.first_name && (
                            <p className="text-sm text-red-500">{errors.first_name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Last Name</label>
                        <input
                            {...register("last_name")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-secondary"
                        />
                        {errors.last_name && (
                            <p className="text-sm text-red-500">{errors.last_name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-secondary"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
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
                        <label className="block mb-1 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-secondary"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            {...register("confirmPassword")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-secondary"
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>


                    <div>
                        <label className="block mb-1 text-sm font-medium">Date of Birth</label>
                        <input
                            type="date"
                            {...register("dob")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-secondary"
                        />
                        {errors.dob && (
                            <p className="text-sm text-red-500">{errors.dob.message}</p>
                        )}
                    </div>

                    
                    <div>
                        <label className="block mb-1 text-sm font-medium">Address</label>
                        <input
                            {...register("address")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-secondary"
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-primary rounded-lg hover:bg-primary/90 focus:ring focus:ring-secondary sm:col-span-2"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Submitting' : "Register"}
                    </button>
                </form>
                
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-500 hover:underline">
                            Proceed to login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
