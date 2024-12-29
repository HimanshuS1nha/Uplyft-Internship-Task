import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BrandLogo from "@/components/BrandLogo";
import Loader from "@/components/loader";

import {
  signupValidator,
  type signupValidatorType,
} from "@/validators/signup-validator";

const SignupPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signupValidatorType>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    resolver: zodResolver(signupValidator),
  });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: signupValidatorType) => {
      if (values.password !== values.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/signup`,
        { ...values }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    },
  });
  return (
    <section className="flex items-center justify-center bg-gray-100 w-full h-dvh">
      <div className="p-5 bg-white w-[90%] sm:w-[60%] lg:w-[40%] xl:w-[35%]  rounded-lg flex flex-col items-center gap-y-10">
        <BrandLogo />

        <form
          className="flex flex-col gap-y-6 w-[95%] lg:w-[90%] items-center"
          onSubmit={handleSubmit((data) => handleLogin(data))}
        >
          <p className="text-3xl font-semibold">Signup for your account</p>
          <div className="flex flex-col gap-y-3 w-full">
            <Label className="ml-1" htmlFor="name">
              Name
            </Label>
            <Input
              placeholder="Enter your name"
              id="name"
              type="text"
              required
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-rose-600 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-3 w-full">
            <Label className="ml-1" htmlFor="email">
              Email
            </Label>
            <Input
              placeholder="Enter your email"
              id="email"
              type="email"
              required
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-rose-600 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-3 w-full">
            <Label className="ml-1" htmlFor="password">
              Password
            </Label>
            <Input
              placeholder="Enter your password"
              id="password"
              type="password"
              required
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-rose-600 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-3 w-full">
            <Label className="ml-1" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <Input
              placeholder="Confirm your password"
              id="confirmPassword"
              type="password"
              required
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <p className="text-rose-600 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader />
                <p>Please wait</p>
              </>
            ) : (
              "Signup"
            )}
          </Button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to={"/login"} className="text-primary underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignupPage;
