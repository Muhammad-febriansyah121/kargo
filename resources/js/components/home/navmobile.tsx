import { url } from "@/utils/url";
import { Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { HiChevronUp } from "react-icons/hi";
import { motion } from "framer-motion";
export default function Navmobile() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [clicked, setClicked] = useState<number | null>(null);
    const toogleDrawer = () => {
        setIsOpen(!isOpen);
    };
    const subMenuDrawer = {
        enter: {
            height: "auto",
            overflow: "hidden",
        },
        exit: {
            height: 0,
            overflow: "hidden",
        },
    };
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    return (
        <div className="z-[999]">
            <button onClick={toogleDrawer} className="relative z-[999] mb-6">
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="size-7"
                >
                    {isOpen ? (
                        <BiX className="size-7" />
                    ) : (
                        <BiMenu className="size-7" />
                    )}
                </motion.div>
            </button>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: isOpen ? 0 : "-100%" }}
                className="fixed right-0 left-0 max-h-screen min-h-screen overflow-y-auto bg-white p-6 pt-10 backdrop-blur"
            >
                <ul className="flex flex-col space-y-3">
                    {url.map((url, index) => {
                        const isClicked = clicked === index;
                        return (
                            <li key={url.id}>
                                {url.subMenu ? (
                                    <button
                                        type="button"
                                        className="hover:text-biru w-full items-start text-sm font-medium text-black hover:font-bold"
                                        onClick={() => {
                                            if (url.subMenu) {
                                                setClicked(
                                                    isClicked ? null : index
                                                );
                                            }
                                        }}
                                    >
                                        <span className="flex items-center justify-between">
                                            {url.name}
                                            {url.subMenu && (
                                                <HiChevronUp
                                                    className={`ml-auto ${
                                                        isClicked &&
                                                        "rotate-180"
                                                    }`}
                                                />
                                            )}
                                        </span>
                                        {url.subMenu && (
                                            <motion.ul
                                                initial="exit"
                                                animate={
                                                    isClicked ? "enter" : "exit"
                                                }
                                                variants={subMenuDrawer}
                                                className={`${
                                                    isClicked
                                                        ? "flex"
                                                        : "hidden"
                                                } mt-5 ml-0 flex-col items-start gap-1 pl-0`}
                                            >
                                                {url.subMenu.map((subMenu) => {
                                                    return (
                                                        <li
                                                            key={
                                                                subMenu.idSubMenu
                                                            }
                                                            className="hover:text-biru rounded-lg px-3 py-2 font-medium text-black hover:bg-white hover:font-semibold"
                                                        >
                                                            <Link
                                                                href={
                                                                    subMenu.url
                                                                }
                                                            >
                                                                {subMenu.name}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </motion.ul>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href={url.url}
                                        className="hover:text-biru text-sm font-medium text-black hover:font-bold"
                                    >
                                        <span className="flex items-center justify-between">
                                            {url.name}
                                            {url.subMenu && (
                                                <HiChevronUp
                                                    className={`ml-auto ${
                                                        isClicked &&
                                                        "rotate-180"
                                                    }`}
                                                />
                                            )}
                                        </span>
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <div className="mt-5 flex flex-row gap-2">
                    <Link
                        href="/home/register"
                        className="bg-biru rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg duration-300 ease-in-out hover:shadow-gray-500"
                    >
                        Sign Up
                    </Link>

                    <Link
                        href="/home/login"
                        className="bg-abuabu rounded-full px-5 py-2 text-sm font-semibold text-black shadow-lg duration-300 ease-in-out hover:shadow-gray-500"
                    >
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
