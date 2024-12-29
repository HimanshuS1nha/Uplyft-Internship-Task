import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import { Button } from "./ui/button";

import { cn } from "@/lib/utils";

import type { MessageType } from "types";

const Message = ({ message }: { message: MessageType }) => {
  const { mutate: handlePurchase, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (productId: number) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { productId },
        { withCredentials: true }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
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
    <div
      className={cn(
        "w-full flex flex-col gap-y-1",
        message.by === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "p-3 min-w-[20%] max-w-[70%] rounded-xl shadow-sm shadow-black",
          message.by === "user"
            ? "bg-primary rounded-br-none"
            : "bg-gray-900 rounded-tl-none"
        )}
      >
        <p className="text-white">{message.content}</p>
      </div>

      <div
        className={cn(
          "p-3 w-[90%] sm:w-[60%] lg:w-[35%] rounded-xl shadow-sm shadow-black",
          message.by === "user"
            ? "bg-primary rounded-br-none"
            : "bg-gray-900 rounded-tl-none"
        )}
      >
        {message.products?.map((product) => {
          return (
            <div
              key={product.id}
              className="flex gap-x-6 text-white items-center"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-12 h-12 rounded-full"
              />

              <div className="flex flex-col">
                <p className="text-lg font-semibold">{product.title}</p>
                <p className="text-sm font-semibold">₹ {product.price}</p>
              </div>

              <Button
                onClick={() => handlePurchase(product.id)}
                disabled={isPending}
              >
                Purchase
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Message;
