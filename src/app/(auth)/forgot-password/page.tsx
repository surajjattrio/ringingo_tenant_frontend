
// PROJECT IMPORT
import SidePanel from "@/components/auth/SidePanel";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Icon } from "@/components/ui-components";

/* ============================== FORGOT - PASSWORD PAGE ============================== */

const ForgotPassword = () => {

    return (
        <>
            <div className="grid grid-cols-2 sm:flex sm:justify-center md:flex md:justify-center 2md:flex 2md:justify-center h-full">
                <SidePanel />
                <div className="container bg-white justify-center flex-col flex px-36 2xl:px-32 xl:px-28 2lg:px-20 lg:px-16 2md:px-24 md:px-20 sm:px-10">
                    <div className="pb-1">
                        <Icon name="MenuLogoExpandedImage" height={100} width={110} alt="Logo" />
                    </div>
                    <div className="pb-7">
                        <p className="text-2xl font-bold">Reset your password</p>
                    </div>
                    <ForgotPasswordForm />
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
