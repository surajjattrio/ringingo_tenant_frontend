"use client";

import { ReactElement, useEffect } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAuth } from "@/contexts/hooks/useAuth";
import Loader from "@/components/ui-components/Loader";

// THIRD - PARTY IMPORT
import Cookies from "js-cookie";

/* ============================== AUTH GUARD ============================== */

const AuthGuard = ({ children }: { children: ReactElement | null }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      if (Cookies.get("role") === "manager") {
        router.push("/manager");
        Cookies.remove('role')
      } else {
        router.push("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return <Loader />;

  return <>{children}</>;
};
export default AuthGuard;
