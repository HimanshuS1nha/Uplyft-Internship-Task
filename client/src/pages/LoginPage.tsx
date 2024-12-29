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

import { useUser } from "@/hooks/useUser";

import {
  loginValidator,
  type loginValidatorType,
} from "@/validators/login-validator";

import type { UserType } from "types";

const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useUser((state) => state.setUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginValidatorType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginValidator),
  });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: loginValidatorType) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { ...values },
        { withCredentials: true }
      );

      return data as { message: string; user: UserType };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setUser(data.user);
      reset();
      navigate("/", { replace: true });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });
  return (
    <section className="flex items-center justify-center bg-gray-100 w-full h-dvh">
      <div className="p-5 bg-white w-[90%] sm:w-[60%] lg:w-[40%] xl:w-[35%] rounded-lg flex flex-col items-center gap-y-10">
        <BrandLogo />

        <form
          className="flex flex-col gap-y-6 w-[95%] lg:w-[90%] items-center"
          onSubmit={handleSubmit((data) => handleLogin(data))}
        >
          <p className="text-3xl font-semibold">Login to your account</p>
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
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader />
                <p>Please wait</p>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <p>
          Don&apos;t have an account?{" "}
          <Link to={"/signup"} className="text-primary underline">
            Signup
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
