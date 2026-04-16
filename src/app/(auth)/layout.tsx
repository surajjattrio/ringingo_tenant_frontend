//PROJECT IMPORT
import { LAYOUT } from "@/config/constant"
import Layouts from "@/components/layouts"

/* ============================== LAYOUT ============================== */

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Layouts variant={LAYOUT.minimal}>
                {children}
            </Layouts>
        </>
    )
}
