
//PROJECT IMPORT
import Accordion from './Accordion';

const CallForward = () => {

    return (
        <>
            <Accordion
                name="call_forward"
                status="call_forwarding_status"
                title="Always Forward"
            />
            <Accordion
                name="on_busy"
                status="on_busy_status"
                title="On Busy"
            />
            <Accordion
                name="no_answered"
                status="no_answered_status"
                title="No Answer"
            />
            <Accordion
                name="not_registered"
                status="not_registered_status"
                title="Not Registered"
            />
        </>
    )
}

export default CallForward