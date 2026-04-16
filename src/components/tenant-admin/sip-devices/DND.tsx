//PROJECT IMPORT
import { LabelSwitch } from "@/components/forms"
import { useSipDevices } from "@/contexts/hooks/useSipDevices"

const DND = () => {
    const { dnd, fillKeyData } = useSipDevices()
    return (
        <>
            <div className="grid grid-cols-3 border-b py-4 items-center">
                <span className="font-semibold text-heading text-xs">Do not disturb:</span>
                <div className="flex">
                    <LabelSwitch
                        checked={dnd === "0"}
                        onChange={() => fillKeyData('dnd', dnd === "0" ? "1" : "0")}
                    />
                </div>
            </div>
        </>
    )
}

export default DND