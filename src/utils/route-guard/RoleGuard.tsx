"use client";
import { ReactElement, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// PROJECT IMPORT
import Loader from "@/components/ui-components/Loader";
import { useAuth } from "@/contexts/hooks/useAuth";
import { useSideBarData } from "@/redux/slice/commonSlice";

/* ============================== ROLE GUARD ============================== */

const RoleGuard = ({ children }: { children: ReactElement | null }) => {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const array = pathname.split("/");
    const sideBarData = useSideBarData();
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        if (!sideBarData?.sideBarUrls?.includes("/" + array[1])) {
            if (user?.role === "tenant") {
                router.push("/tenant-dashboard");
            } else if (user?.role === "master_admin") {
                router.push("/dashboard");
            } else if (user?.role === "manager") {
                router.push("/manager-dashboard");
            } else {
                router.push("/login");
            }
        }
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (isLoading) return <Loader />;

    return <>{children}</>;
};

export default RoleGuard;
