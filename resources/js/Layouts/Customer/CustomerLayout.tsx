import FooterCustomer from "@/components/customer/footer";
import NavbarCustomer from "@/components/customer/navbar";
import Sidebar from "@/components/customer/sidebar";
import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
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
export default function CustomerLayout({ children, auth }: Props) {
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
                <Sidebar setting={setting} />
                <div className="flex flex-col mb-5 overflow-hidden">
                    <NavbarCustomer setting={setting} auth={auth} />
                    <main>{children}</main>
                    <FooterCustomer setting={setting} auth={auth} />
                </div>
            </div>
        </>
    );
}
