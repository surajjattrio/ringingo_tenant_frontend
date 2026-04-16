// PROJECT IMPORT
import { InboundProvider } from "@/contexts/InboundContext"

/* ============================== LAYOUT ============================== */

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <InboundProvider>
                {children}
        </InboundProvider>
        </>
    )
}
