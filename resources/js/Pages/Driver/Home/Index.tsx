import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import DriverLayout from "@/Layouts/Driver/DriverLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";

interface Props {
    setting: SettingType;
    auth: UserType;
}
export default function Index({ setting, auth }: Props) {
    return (
        <DriverLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10">
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-2xl">Dashboard</h3>
                        <p className="text-sm text-gray-500 max-w-xl">
                            Selamat datang <strong>{auth.name}</strong> di{" "}
                            {setting.site_name}. Anda dapat mengelola semua data
                            yang terkait dengan akun Anda di sini.
                        </p>
                    </div>
                </div>
            </section>
        </DriverLayout>
    );
}
