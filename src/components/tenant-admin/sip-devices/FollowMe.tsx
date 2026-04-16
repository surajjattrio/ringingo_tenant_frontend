//PROJECT IMPORT
import { useSipDevices } from "@/contexts/hooks/useSipDevices"
import { useSipOptions } from "@/redux/slice/tenant-admin/sipDevicesSlice"
import { LabelSwitch, Select } from "@/components/forms"

const FollowMe = () => {
    const { follow_me, onFollowMeChange, onDestinationChange } = useSipDevices()
    const sipOptions = useSipOptions()

    return (
        <>
            <div className="grid grid-cols-3 border-b py-4 items-center">
                <span className="font-semibold text-heading text-xs">Follow me:</span>
                <div className="flex">
                    <LabelSwitch
                        checked={follow_me?.follow_me_status === 0}
                        onChange={() => onFollowMeChange('follow_me_status', follow_me?.follow_me_status === 0 ? 1 : 0)}
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 border-b py-4 items-center">
                <span className="font-semibold text-heading text-xs">Ignore busy:</span>
                <div className="flex">
                    <LabelSwitch
                        trueName="Yes"
                        falseName="No"
                        checked={follow_me?.ignore_busy === 0}
                        onChange={() => onFollowMeChange('ignore_busy', follow_me?.ignore_busy === 0 ? 1 : 0)}
                    />
                </div>
            </div>
            {follow_me?.follow_me_status === 0 && follow_me?.destination?.map((val: any, idx: number) => {
                return (
                    <div key={idx} className="grid grid-cols-3 items-center border-b py-4">
                        <span className="font-semibold text-xs text-heading">Destination {idx+1}:</span>
                        <Select
                            name="destination"
                            placeholder="Select"
                            isShowLabel={false}
                            removable
                            options={sipOptions}
                            value={val}
                            onChange={(e: any) => {
                                onDestinationChange(e.target.value, idx)
                            }}
                        />
                    </div>
                )
            })}
        </>
    )
}

export default FollowMe