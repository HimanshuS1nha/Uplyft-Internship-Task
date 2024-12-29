import { useState } from "react";
import { Bot } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import ChatInput from "@/components/chat-input";
import Message from "@/components/message";
import Navbar from "@/components/navbar";

import type { MessageType } from "../../types";
import toast from "react-hot-toast";

const HomePage = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      by: "bot",
      content: "Here are the products",
      products: [
        {
          description: "doea",
          title: "My product",
          price: 100,
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWJuwr8vTqrxZXJAIbQXk3mUZM3l5o3881gQ&s",
          id: 5,
        },
      ],
    },
  ]);
  const [input, setInput] = useState("");

  const { mutate: handleGetBotResponse, isPending } = useMutation({
    mutationKey: ["get-bot-response"],
    mutationFn: async (userInput: string) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/get-response`,
        { userInput },
        { withCredentials: true }
      );

      return data as { response: string };
    },
    onSuccess: (data) => {
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          { by: "bot", content: data.response },
        ] as MessageType[];
        return newMessages;
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });

  const handleSend = () => {
    if (input === "") {
      return;
    }

    setMessages((prev) => {
      const newMessages = [
        ...prev,
        { by: "user", content: input },
      ] as MessageType[];
      return newMessages;
    });
    handleGetBotResponse(input);
    setInput("");
  };
  return (
    <div className="flex flex-col w-full h-dvh">
      <Navbar setMessages={setMessages} />
      <main className="flex items-center justify-center w-full mt-[8dvh] min-h-[92dvh] px-4 sm:px-10 md:px-16 lg:px-24 xl:px-48 2xl:px-72 relative">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-y-5 items-center">
            <div className="bg-primary p-2 rounded-full">
              <Bot color="white" size={40} />
            </div>
            <div className="flex flex-col gap-y-2.5 items-center">
              <h1 className="text-3xl text-primary font-bold">Sales Chatbot</h1>
              <p className="text-sm text-gray-700">Ask your queries here</p>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-[92dvh] flex flex-col justify-end pb-16 px-2.5 gap-y-3">
            {messages.map((message, i) => {
              return <Message key={i} message={message} />;
            })}
          </div>
        )}
        <ChatInput
          value={input}
          setValue={setInput}
          handleSend={handleSend}
          disabled={isPending}
        />
      </main>
    </div>
  );
};

export default HomePage;
