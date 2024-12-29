import { cn } from "@/lib/utils";

const BrandLogo = ({ size = "lg" }: { size?: "sm" | "lg" }) => {
  return (
    <h1
      className={cn(
        "text-primary font-bold",
        size === "lg" ? "text-3xl md:text-5xl" : "sm:text-xl"
      )}
    >
      Sales Chatbot
    </h1>
  );
};

export default BrandLogo;
