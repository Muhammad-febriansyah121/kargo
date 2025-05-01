import FooterDriver from "@/components/driver/footer";
import NavbarDriver from "@/components/driver/navbar";
import SidebarDriver from "@/components/driver/sidebar";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import { Head, usePage } from "@inertiajs/react";

type Props = {
    children: React.ReactNode;
    auth: UserType;
};
interface SettingProps {
    setting: SettingType;
}
export default function DriverLayout({ children, auth }: Props) {
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
            <div className="flex flex-row justify-start">
                <SidebarDriver setting={setting} />
                <div className="flex flex-col mb-5 overflow-hidden">
                    <NavbarDriver setting={setting} auth={auth} />
                    <main>{children}</main>
                    <FooterDriver setting={setting} auth={auth} />
                </div>
            </div>
        </>
    );
}
