//PROJECT IMPORT
import { LabelSwitch } from "@/components/forms"
import { useSipDevices } from "@/contexts/hooks/useSipDevices"

const CallRecording = () => {

    const { recording, fillKeyData } = useSipDevices()

    return (
        <>
            <div className="grid grid-cols-3 border-b py-4 items-center">
                <span className="font-semibold text-heading text-xs">Recording:</span>
                <div className="flex">
                    <LabelSwitch
                        trueName="Yes"
                        falseName="No"
                        checked={recording === "0"}
                        onChange={() => fillKeyData('recording', recording === "0" ? "1" : "0")}
                    />
                </div>
            </div>
        </>
    )
}

export default CallRecording