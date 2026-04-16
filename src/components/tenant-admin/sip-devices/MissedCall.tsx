//PROJECT IMPORT
import { Input } from "@/components/forms"
import { useSipDevices } from "@/contexts/hooks/useSipDevices"

const MissedCall = () => {
    const { mail_to, fillKeyData } = useSipDevices()
    return (
        <>
            <div className="grid grid-cols-3 border-b py-4 items-center">
                <span className="font-semibold text-heading text-xs">Mail to:</span>
                <Input
                    name="mail_to"
                    value={mail_to}
                    isShowLabel={false}
                    placeholder="Enter Email"
                    icon="EmailGray"
                    onChange={(e: any) => fillKeyData("mail_to", e.target.value)}
                />
            </div>
        </>
    )
}

export default MissedCall