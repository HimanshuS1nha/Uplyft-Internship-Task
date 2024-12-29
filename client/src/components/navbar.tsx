import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import BrandLogo from "./BrandLogo";
import { Button } from "./ui/button";

import { useUser } from "@/hooks/useUser";

import type { MessageType } from "types";
import { CirclePower, LogOut } from "lucide-react";

const Navbar = ({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { mutate: handleLogout, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        { withCredentials: true }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login", { replace: true });
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
    <nav className="fixed flex w-full justify-between px-3 sm:px-8 items-center h-[8dvh]">
      <BrandLogo size="sm" />

      <p className="sm:text-lg">
        Welcome <span className="font-semibold">{user?.name}</span>
      </p>

      <div className="flex gap-x-2 items-center">
        <Button onClick={() => setMessages([])} variant={"secondary"}>
          <CirclePower color="black" />
        </Button>
        <Button
          onClick={() => handleLogout()}
          variant={"destructive"}
          disabled={isPending}
        >
          <LogOut color="white" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
