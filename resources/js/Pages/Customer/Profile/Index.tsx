import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import React from "react";
import FormProfile from "./components/form";
import { CityType } from "@/types/city";
import { PesantrenType } from "@/types/pesantre";

interface Props {
    auth: UserType;
    setting: SettingType;
    user: UserType;
    city: CityType[];
    pesantren: PesantrenType[];
}
export default function Index({ auth, user, city, pesantren }: Props) {
    return (
        <CustomerLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-gray-600">
                        Hai {auth.name}, yuk sesuaikan profilmu di sini!{" "}
                    </p>
                    <div className="flex flex-col gap-4">
                        <FormProfile
                            city={city}
                            user={user}
                            pesantren={pesantren}
                        />
                    </div>
                </div>
            </section>
        </CustomerLayout>
    );
}
