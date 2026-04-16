// PROJECT IMPORT
import { OutboundProvider } from "@/contexts/OutboundContext"

/* ============================== LAYOUT ============================== */

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <OutboundProvider>
                {children}
            </OutboundProvider>
        </>
    )
}
