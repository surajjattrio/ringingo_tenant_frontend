// PROJECT IMPORT
import { BlendedProvider } from "@/contexts/BlendedContext"

/* ============================== LAYOUT ============================== */

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <BlendedProvider>
                {children}
            </BlendedProvider>
        </>
    )
}
