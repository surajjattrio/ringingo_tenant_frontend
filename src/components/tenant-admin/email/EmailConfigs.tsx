"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// COMPONENTS
import Tabs from "../../ui-components/Tabs";
import EmailConfigsList from "./EmailConfigsList";
import ApiConfiguration from "./ApiConfiguration";
import MessageConfigurationList from "./MessageConfigurationList";

// TYPES
import { ManagerPageTypes } from "@/types/formTypes";

const EmailConfigsContent = (props: ManagerPageTypes) => {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") || "email_config";
    const [activeTab, setActiveTab] = useState(tabParam);

    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const tabData = [
        {
            id: "email_config",
            title: "Email Config",
            icon: "EmailGray" as any,
            activeIcon: "Email" as any,
            component: () => <EmailConfigsList {...props} />,
        },
        {
            id: "api_config",
            title: "API Config",
            icon: "Integrations" as any,
            activeIcon: "IntegrationGreen" as any,
            component: () => <ApiConfiguration />,
        },
        {
            id: "message_config",
            title: "Message Config",
            icon: "Message" as any,
            activeIcon: "MessagingGreen" as any,
            component: () => <MessageConfigurationList />,
        },
    ];

    return (
        <div className="bg-white rounded-[25px] overflow-hidden">
            <Tabs
                data={tabData}
                active={activeTab}
                onChange={(id: string) => setActiveTab(id)}
            />
        </div>
    );
};

const EmailConfigs = (props: ManagerPageTypes) => {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <EmailConfigsContent {...props} />
        </Suspense>
    );
};

export default EmailConfigs;
