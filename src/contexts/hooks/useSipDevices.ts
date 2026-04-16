import { useContext } from "react"

// PROJECT IMPORT
import SipDevicesContext from "../SipDevicesContext"

export const useSipDevices = () => {
    const context = useContext(SipDevicesContext)
    if (!context) throw new Error("context must be use inside sip device provider");
    return context
}