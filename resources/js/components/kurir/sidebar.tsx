import { SettingType } from "@/types/setting";
import { UrlKurir } from "@/utils/url_kurir";
import { Link, usePage } from "@inertiajs/react";
import React from "react";

interface Props {
    setting: SettingType;
}
export default function SidebarKurir({ setting }: Props) {
    const { url: currentUrl } = usePage();

    return (
        <div className="h-screen fixed flex-none space-y-5 bg-white py-6 px-4 w-[250px] lg:block hidden">
            <div className="flex flex-col space-y-5 h-full">
                <div className="logo flex flex-row justify-center items-center gap-x-2">
                    <img
                        src={`/storage/${setting.long_logo}`}
                        className="w-20 h-w-20"
                        alt=""
                    />
                </div>
                <div className="pt-5 flex flex-col gap-[18px]">
                    <h3 className="font-semibold text-sm leading-[21px]">
                        Main Menu
                    </h3>

                    <ul className="flex flex-col gap-y-3">
                        {UrlKurir.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link
                                        href={item.url}
                                        className={
                                            currentUrl === item.url
                                                ? "flex items-center gap-[10px] bg-biru  group-hover:shadow-biru py-2.5 px-4 font-medium h-12 rounded-2xl hover:bg-biru group"
                                                : "flex items-center gap-[10px]   py-2.5 px-4  h-12 transition-all duration-200 group"
                                        }
                                    >
                                        {React.cloneElement(item.icon, {
                                            className:
                                                currentUrl === item.url
                                                    ? "w-6 h-6 text-white" // Untuk ikon yang aktif
                                                    : "w-6 h-6 text-muted-foreground", // Untuk ikon yang tidak aktif
                                        })}
                                        <span
                                            className={
                                                currentUrl === item.url
                                                    ? "text-white font-semibold text-base"
                                                    : "font-medium text-black text-base"
                                            }
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
