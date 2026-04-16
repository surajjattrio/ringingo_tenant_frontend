//PROJECT IMPORT
import { SipDevicesProvider } from "@/contexts/SipDevicesContext"

/* ============================== LAYOUT ============================== */

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <SipDevicesProvider>
                {children}
            </SipDevicesProvider>
        </>
    )
}
