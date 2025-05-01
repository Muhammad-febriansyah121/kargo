import React from "react";
import { SettingType } from "@/types/setting";
import {
    BsFacebook,
    BsInstagram,
    BsTelephone,
    BsWhatsapp,
    BsYoutube,
} from "react-icons/bs";
import { BiEnvelope } from "react-icons/bi";
import { Facebook, MapPin } from "lucide-react";
import { PulsatingButton } from "../magicui/pulsating-button";
import { Link } from "@inertiajs/react";

interface Props {
    setting: SettingType;
}
export default function Footer({ setting }: Props) {
    return (
        <>
            <div className="h-40 md:h-32"></div>
            <footer className="relative container mt-40  mb-5">
                <div className="bg-gradient-to-r from-biru flex flex-col md:flex-row gap-5 justify-between  to-blue-300 p-5 md:p-10 md:rounded-2xl items-center -top-[23rem] mt-20 md:mt-0 md:-top-[10rem] lg:-top-[11rem] w-full md:w-[85%]  absolute z-10 left-1/2 -translate-x-1/2">
                    <div className="flex flex-col items-center gap-2.5 max-w-xl">
                        <h3 className="text-white font-bold text-center md:text-start text-lg md:text-xl">
                            Kembangkan Bisnismu Bersama {setting.site_name}{" "}
                            Ekspres
                        </h3>
                        <p className="text-white text-sm md:text-base text-center md:text-start font-medium">
                            Kirim paket dengan {setting.site_name} Ekspres lebih
                            cepat sampai tujuan.
                        </p>
                    </div>
                    <Link href={"/home/register"}>
                        <PulsatingButton>Daftar Sekarang</PulsatingButton>
                    </Link>
                </div>
                <div className="bg-white rounded-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 p-10 gap-5 justify-between">
                        <div className="fle flex-col gap-3">
                            <img
                                src={`/storage/${setting.logo}`}
                                className="bg-cover w-30 h-20"
                                alt=""
                            />
                            <p className="text-gray-500 font-medium text-sm">
                                {setting.description}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-gray-500 font-medium text-sm">
                                Info Kontak
                            </span>
                            <ul className="p-1 space-y-3">
                                <li className="flex gap-x-2 text-sm font-semibold items-center text-gray-500">
                                    <BsWhatsapp
                                        size={15}
                                        className="fill-biru shrink-0"
                                    />{" "}
                                    <span>{setting.phone}</span>
                                </li>
                                <li className="flex gap-x-2 text-sm font-semibold items-center text-gray-500">
                                    <BiEnvelope
                                        size={15}
                                        className="fill-biru shrink-0"
                                    />{" "}
                                    <span>{setting.email}</span>
                                </li>
                                <li className="flex gap-x-2 text-xs font-medium text-gray-500">
                                    <MapPin
                                        size={15}
                                        className="text-biru shrink-0"
                                    />{" "}
                                    <span>{setting.address}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <span className="text-gray-500 font-medium text-sm">
                                Quick Link
                            </span>
                            <ul className="space-y-2">
                                <li className="text-sm font-semibold text-gray-500">
                                    <Link href={"/home/login"}>Login</Link>
                                </li>
                                <li className="text-sm font-semibold text-gray-500">
                                    <Link href={"/home/register"}>
                                        Registrasi
                                    </Link>
                                </li>
                                <li className="text-sm font-semibold text-gray-500">
                                    <Link href={"/home/contact"}>
                                        Kontak Kami
                                    </Link>
                                </li>
                                <li className="text-sm font-semibold text-gray-500">
                                    <Link href={"/home/news"}>Berita</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <span className="text-gray-500 font-medium text-sm">
                                Informasi
                            </span>
                            <ul className=" space-y-2">
                                <li className="text-sm font-semibold text-gray-500">
                                    <Link href={"/home/faq"}>Faq</Link>
                                </li>
                                <li className="text-sm font-semibold text-gray-500">
                                    <Link href={"/home/term"}>
                                        Term & Condition
                                    </Link>
                                </li>
                                <li className="text-sm font-semibold text-gray-500">
                                    <Link href={"/home/privacypolicy"}>
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li className="text-sm font-semibold text-gray-500">
                                    <Link href={"/home/definisi"}>
                                        Definisi
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="p-3">
                        <hr className="mb-2.5" />
                        <span className="text-gray-500 text-sm text-center font-semibold flex items-center justify-center">
                            {new Date().getFullYear()} {setting.site_name}. All
                            rights
                        </span>
                    </div>
                </div>
            </footer>
        </>
    );
}
