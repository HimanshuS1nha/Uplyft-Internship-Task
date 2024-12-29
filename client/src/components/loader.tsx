import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const Loader = ({
  className,
  color = "white",
}: {
  className?: string;
  color?: string;
}) => {
  return <Loader2 color={color} className={cn("animate-spin", className)} />;
};

export default Loader;
