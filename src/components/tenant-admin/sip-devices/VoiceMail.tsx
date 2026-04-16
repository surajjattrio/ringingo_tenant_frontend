
//PROJECT IMPORT 
import { useSipDevices } from "@/contexts/hooks/useSipDevices";
import { Input, LabelSwitch, Password, Switch } from "@/components/forms";

const VoiceMail = () => {
    const { voicemail, onVoiceMailChange } = useSipDevices()

    return (
        <>
            <div>
                <div className="grid grid-cols-3 border-b py-4 items-center">
                    <span className="font-semibold text-heading text-xs">Enable:</span>
                    <div className="flex">
                        <LabelSwitch
                            checked={voicemail?.voicemail_status === 0}
                            onChange={() => onVoiceMailChange('voicemail_status', voicemail?.voicemail_status === 0 ? 1 : 0)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 border-b py-4 items-center">
                    <span className="font-semibold text-heading text-xs">Password:</span>
                    <Password
                        name="password"
                        value={voicemail.password}
                        isShowLabel={false}
                        placeholder="Enter Password"
                        onChange={(e: any) => onVoiceMailChange('password', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-3 border-b py-4 items-center">
                    <span className="font-semibold text-heading text-xs">Mail to:</span>
                    <Input
                        name="mail_to"
                        value={voicemail?.mail_to}
                        isShowLabel={false}
                        placeholder="Enter Email"
                        icon="EmailGray"
                        onChange={(e: any) => onVoiceMailChange('mail_to', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-3 border-b py-4 items-center">
                    <span className="font-semibold text-heading text-xs">Attach file:</span>
                    <Switch
                        className="pt-[2px]"
                        switchButtonClass="py-1.5"
                        trueName="Yes"
                        falseName="No"
                        value={voicemail?.attach_file}
                        onClick={(value: string) => onVoiceMailChange('attach_file', value)}
                    />
                </div>
            </div>
        </>
    )
}

export default VoiceMail