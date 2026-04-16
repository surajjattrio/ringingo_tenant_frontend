// "use client";
// import React, { useEffect, useLayoutEffect, useState } from "react";
// import Head from 'next/head';
// import { Helmet } from 'react-helmet';
// // PROJECT IMPORT
// import SidePanel from "@/components/auth/SidePanel";
// import LoginForm from "@/components/auth/LoginForm";
// import { Icon } from "@/components/ui-components";
// import {
//     getTenantPersonalization
// } from "@/redux/slice/master-admin/tenantSlice";
// import getDomain from "@/utils/GetDoamin";
// import { useAppDispatch } from "@/redux/hooks";
// /* ============================== LOGIN PAGE ============================== */

// const baseUrl = process.env.BASE_URL;
// const FaviconIcon = "/assets/images/xcess-collapsed-logo.png";



// const Login = () => {

//     const domain = getDomain();
//     const dispatch = useAppDispatch();

//     const [loading, setLoading] = useState<boolean>(false);
//     const [personalizeData, setPersonalizeData] = useState<any>({});


//     const getTenantPersonalizeData = async () => {
//         setLoading(true);
//         try {
//             const res: any = await dispatch(getTenantPersonalization(domain)).unwrap();
//             if (res?.statusCode === 200) {
//                 setPersonalizeData(res?.data);
//             }
//             setLoading(false);
//         } catch (err) {
//             setLoading(false);
//             console.error("Get Tenant Personlize Data Err =-=>", err);
//         }
//     };

//     useLayoutEffect(() => {
//         getTenantPersonalizeData();
//     }, []);

//     return (
//         <>
//             {personalizeData?.title && personalizeData?.faviconfile ?
//                 <Helmet>
//                     <title>{personalizeData.title}</title>
//                     <link rel="icon" type="image/svg" href={baseUrl + `/tenant/download/${personalizeData?.faviconfile}`} />
//                 </Helmet>
//                 :
//                 <Helmet>
//                     <title>{process.env.TITLE}</title>
//                     <link rel="icon" href={FaviconIcon} />
//                 </Helmet>
//             }
//             <div className="flex justify-center items-center min-h-screen" style={{ backgroundImage: 'url("/assets/images/bg.avif")', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', backgroundColor: 'rgba(255, 255, 255, 10)' }} >

//                 <div className="p-5 rounded-md text-center bg-white-opacity-80" style={{ border: '1px solid #e84545' }}>
//                     <div className="flex justify-center items-center pl-10 mb-3">
//                         <Icon name="MenuLogoExpandedImage" height={400} width={200} alt="Logo" />
//                     </div>
//                     {/* <p className="text-lg font-semibold mb-2">Log in to your account</p> */}
//                     <LoginForm />
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Login;










"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Head from 'next/head';
import { Helmet } from 'react-helmet';
// PROJECT IMPORT
import SidePanel from "@/components/auth/SidePanel";
import LoginForm from "@/components/auth/LoginForm";
import { Icon } from "@/components/ui-components";
import {
    getTenantPersonalization
} from "@/redux/slice/master-admin/tenantSlice";
import getDomain from "@/utils/GetDoamin";
import { useAppDispatch } from "@/redux/hooks";
/* ============================== LOGIN PAGE ============================== */

const baseUrl = process.env.BASE_URL;
const FaviconIcon = process.env.COLLAPSED_LOGO;
// const FaviconIcon = "/assets/images/xcess-collapsed-logo.png";
// const FaviconIcon = "/assets/images/aargon-favicon2.ico";



const Login = () => {

    const domain = getDomain();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState<boolean>(false);
    const [personalizeData, setPersonalizeData] = useState<any>({});


    const getTenantPersonalizeData = async () => {
        setLoading(true);
        try {
            const res: any = await dispatch(getTenantPersonalization(domain)).unwrap();
            if (res?.statusCode === 200) {
                setPersonalizeData(res?.data);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Tenant Personlize Data Err =-=>", err);
        }
    };

    useLayoutEffect(() => {
        getTenantPersonalizeData();
    }, []);

    return (
        <>
            {personalizeData?.title && personalizeData?.faviconfile ?
                <Helmet>
                    <title>{personalizeData.title}</title>
                    <link rel="icon" type="image/svg" href={baseUrl + `/tenant/download/${personalizeData?.faviconfile}`} />
                </Helmet>
                :
                <Helmet>
                    <title>{process.env.TITLE}</title>
                    <link rel="icon" href={FaviconIcon} />
                </Helmet>
            }
            <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat" style={{
  backgroundImage: 'url("/assets/images/Loginbg.png")',
}}>
                <div className="p-5 rounded-md">
                    {/* <div className="flex justify-center items-center mb-3">
                        <Icon name="MenuLogoExpandedImage" height={80} width={200} alt="Logo" />
                    </div> */}
                    <LoginForm />
                </div>
            </div>
        </>
    );
};

export default Login;
