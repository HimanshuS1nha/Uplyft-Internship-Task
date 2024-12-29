import React from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ChatInput = ({
  value,
  setValue,
  handleSend,
  disabled,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  disabled: boolean;
}) => {
  return (
    <form
      className="fixed bg-white bottom-0 pb-2 w-full flex gap-x-4 px-4 sm:px-10 md:px-16 lg:px-24 xl:px-48 2xl:px-72"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
    >
      <Input
        placeholder="Type here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <Button disabled={value.trim() === "" || disabled} type="submit">
        <SendHorizonal color="white" />
      </Button>
    </form>
  );
};

export default ChatInput;
