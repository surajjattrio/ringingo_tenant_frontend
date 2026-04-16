// PROJECT IMPORT
import { VoiceBroadcastProvider } from "@/contexts/VoiceBroadcastContext";

/* ============================== LAYOUT ============================== */

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <VoiceBroadcastProvider>{children}</VoiceBroadcastProvider>
        </>
    );
}
