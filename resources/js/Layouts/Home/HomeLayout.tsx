import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import { SettingType } from "@/types/setting";
import { Head, usePage } from "@inertiajs/react";
import React from "react";

type Props = {
    children: React.ReactNode;
};
interface SettingProps {
    setting: SettingType;
}
export default function HomeLayout({ children }: Props) {
    const { setting } = usePage().props as unknown as SettingProps;

    return (
        <>
            <Head>
                <title>{setting.site_name}</title>
                <meta
                    head-key="description"
                    name="description"
                    content={setting.keyword}
                />
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href={`/storage/${setting.logo}`}
                />
            </Head>
            <div className="overflow-x-hidden">
                <Navbar setting={setting} />
                {children}
                <Footer setting={setting} />
            </div>
        </>
    );
}
