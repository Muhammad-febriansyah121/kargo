import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import { CityType } from "@/types/city";
import { WareHouseType } from "@/types/warehouse";
import FormProfileKurir from "./components/form";
import KurirLayout from "@/Layouts/Kurir/KurirLayout";

interface Props {
    auth: UserType;
    setting: SettingType;
    user: UserType;
    city: CityType[];
    warehouse: WareHouseType[];
}
export default function Index({ auth, user, city, warehouse }: Props) {
    return (
        <KurirLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-gray-600">
                        Hai {auth.name}, yuk sesuaikan profilmu di sini!{" "}
                    </p>
                    <div className="flex flex-col gap-4">
                        <FormProfileKurir
                            city={city}
                            user={user}
                            warehouse={warehouse}
                        />
                    </div>
                </div>
            </section>
        </KurirLayout>
    );
}
