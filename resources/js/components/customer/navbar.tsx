import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

interface Props {
    setting: SettingType;
    auth: UserType;
}
export default function NavbarCustomer({ setting, auth }: Props) {
    const handleLogout = () => {
        router.post(route("customers.logout"));
    };
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000); // Update setiap 1 detik

        return () => clearInterval(interval);
    }, []);

    const formattedDate = now.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return (
        <div className="flex-auto w-screen lg:pl-[250px]">
            <div className="w-full bg-white py-4 px-7">
                <div className="flex flex-row justify-between items-center">
                    <div className="hidden md:block w-full md:w-[500px] p-3">
                        <span className="font-semibold text-gray-600 text-xl pt-5">
                            {formattedDate} {formattedTime}
                        </span>
                    </div>
                    <div className="w-auto ml-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-x-3 cursor-pointer">
                                    <div className="flex flex-col text-right">
                                        <h3 className="text-indigo-950 font-semibold text-base">
                                            {auth.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {auth.email}
                                        </p>
                                    </div>

                                    <img
                                        src="/images/default-avatar.svg"
                                        alt="Avatar"
                                        className="h-[40px] w-[40px] md:h-[50px] md:w-[50px] rounded-full object-cover"
                                    />
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    {auth.name}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>My Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}
