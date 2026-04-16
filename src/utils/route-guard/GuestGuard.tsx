"use client";
import { ReactElement, useEffect } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAuth } from "@/contexts/hooks/useAuth";
import Loader from "@/components/ui-components/Loader";

/* ============================== GUEST GUARD ============================== */

const GuestGuard = ({ children }: { children: ReactElement | null }) => {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      if (user?.role === "manager") {
        router.push("/manager-dashboard");
      } else if (user?.role === "tenant") {
        router.push("/tenant-dashboard");
      } else {
        router.push("/dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, router]);

  if (isLoggedIn) return <Loader />;

  return <>{children}</>;
};

export default GuestGuard;
