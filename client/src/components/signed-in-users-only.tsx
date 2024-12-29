import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import { useUser } from "@/hooks/useUser";

import type { UserType } from "types";

const SignedInUsersOnly = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { setUser, user } = useUser();

  const [showPage, setShowPage] = useState(false);

  const { data, error } = useQuery({
    queryKey: ["is-logged-in"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/is-logged-in`,
        { withCredentials: true }
      );

      return data as { user: UserType };
    },
    retry: 1,
  });
  if (error) {
    toast.error("Please login first");
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    if (user) {
      setShowPage(true);
    }
  }, [user]);

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);
  return <>{showPage && children}</>;
};

export default SignedInUsersOnly;
