// PROJECT IMPORT
import SidePanel from "@/components/auth/SidePanel";
import { Icon } from "@/components/ui-components";
import VerifyLicense from "@/components/auth/VerifyLicense";

/* ============================== LOGIN PAGE ============================== */

const Login = () => {
    return (
        <>
            <div className="grid grid-cols-2 h-full tsm:flex-col-reverse">
                <SidePanel />
                <div className="container bg-white justify-center flex-col flex px-36 2xl:px-32 xl:px-28 2lg:px-20 lg:px-16 2md:px-24 md:px-20 sm:px-10">
                    <div className="pb-1">
                        <Icon name="MenuLogoExpandedImage" height={100} width={110} alt="Logo" />
                    </div>
                    <div className="pb-5">
                        <p className="text-2xl font-bold">Authentication</p>
                        </div>
                    <VerifyLicense />
                </div>
            </div>

        </>
    );
};

export default Login;