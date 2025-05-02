import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import { UrlCustomer } from "@/utils/url_customer";
import { Link, usePage } from "@inertiajs/react";
import React from "react";

interface Props {
    setting: SettingType;
    auth: UserType;
}
export default function FooterCustomer({ setting, auth }: Props) {
    const { url: currentUrl } = usePage();

    return (
        <>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <footer className="block lg:hidden bg-white rounded-t-2xl fixed bottom-0 w-full p-5">
                <div className="flex items-center gap-4 justify-between md:justify-around">
                    {UrlCustomer.map((item, index) => {
                        return (
                            <Link
                                key={index}
                                href={item.url}
                                className={
                                    currentUrl === item.url
                                        ? "flex flex-col items-center gap-3 bg-biru py-3 px-4 rounded-2xl"
                                        : "flex flex-col items-center gap-3 "
                                }
                            >
                                {React.cloneElement(item.icon, {
                                    className:
                                        currentUrl === item.url
                                            ? "w-6 h-6 text-white" // Untuk ikon yang aktif
                                            : "w-6 h-6 text-black", // Untuk ikon yang tidak aktif
                                })}
                                {/* <span
                                className={
                                    currentUrl === item.url
                                        ? "text-white text-sm text-center font-semibold"
                                        : "text-black text-sm text-center font-medium"
                                }
                            >
                                {item.name}
                            </span> */}
                            </Link>
                        );
                    })}
                </div>
            </footer>
        </>
    );
}
