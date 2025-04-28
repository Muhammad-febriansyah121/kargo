import { SettingType } from "@/types/setting";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Navmobile from "./navmobile";
import { url } from "@/utils/url";
import { HiChevronUp } from "react-icons/hi";

interface Props {
    setting: SettingType;
}

export default function Navbar({ setting }: Props) {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const { url: currentUrl } = usePage();
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <nav
            className={`fixed inset-0 z-[999] flex h-20 items-center ${
                isScrolled ? "bg-opacity-30 backdrop-blur-md" : ""
            }`}
        >
            <div className="container flex items-center justify-between p-3.5">
                <Link href={route("home")}>
                    <img
                        src={`/storage/${setting.long_logo}`}
                        alt=""
                        className="h-20 w-20"
                    />
                </Link>
                <div className="hidden lg:block">
                    <ul className="flex items-center space-x-2 text-black">
                        {url.map((url) => {
                            return (
                                <li
                                    key={url.id}
                                    className={
                                        url.subMenu
                                            ? "group relative cursor-pointer"
                                            : "cursor-pointer"
                                    }
                                >
                                    <Link
                                        href={url.url}
                                        className={
                                            currentUrl === url.url
                                                ? "text-biru hover:text-biru text-base inline-block px-3 py-1 font-medium transition-all duration-150 hover:font-semibold"
                                                : url.subMenu
                                                ? "hover:text-biru text-black text-base flex h-[72px] items-center gap-[2px] px-3 py-1 font-medium transition-all duration-150 hover:font-semibold"
                                                : "hover:text-biru text-black text-base inline-block px-3 py-1 font-medium transition-all duration-150 hover:font-semibold"
                                        }
                                    >
                                        {url.name}
                                        {url.subMenu && (
                                            <HiChevronUp className="transition-all duration-200 group-hover:rotate-180" />
                                        )}
                                    </Link>
                                    <div className="absolute -left-9 z-[99] hidden w-[350px] rounded-xl bg-white p-5 text-black group-hover:block">
                                        <ul className="space-y-3 grid grid-cols-2 items-center">
                                            {url.subMenu?.map((subMenu) => {
                                                return (
                                                    <li
                                                        key={subMenu.idSubMenu}
                                                        className="hover:text-biru text-sm cursor-pointer rounded-lg px-3 py-2 font-medium transition-all duration-200 hover:bg-white hover:font-semibold"
                                                    >
                                                        <Link
                                                            href={subMenu.url}
                                                        >
                                                            {subMenu.name}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="hidden items-center space-x-3 lg:flex">
                    <Link
                        href="/home/register"
                        className="bg-biru rounded-full px-5 py-2 text-base font-semibold text-white shadow-lg duration-300 ease-in-out hover:shadow-gray-500"
                    >
                        Sign Up
                    </Link>
                    <Link
                        href="/home/login"
                        className="bg-white rounded-full px-5 py-2 text-base font-semibold text-biru shadow-lg duration-300 ease-in-out hover:shadow-gray-500"
                    >
                        Sign In
                    </Link>
                    {/* <Link
                        href="/home/register"
                        className="bg-abuabu rounded-full px-5 py-2 text-base font-semibold text-black shadow-lg duration-300 ease-in-out hover:shadow-gray-500"
                    >
                        Sign In
                    </Link> */}
                </div>
                <div className="lg:hidden">
                    <Navmobile />
                </div>
            </div>
        </nav>
    );
}
