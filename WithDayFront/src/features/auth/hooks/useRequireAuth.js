import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../lib/getAuthUser";

export const useRequireAuth = () => {
  const navigate = useNavigate();
  const [authUser] = useState(() => getAuthUser());

  useEffect(() => {
    if (!authUser?.email) {
      navigate("/login", { replace: true });
    }
  }, [authUser, navigate]);

  return useMemo(
    () => ({
      authUser,
      authEmail: authUser?.email?.trim() ?? "",
      isAuthenticated: Boolean(authUser?.email),
    }),
    [authUser]
  );
};
