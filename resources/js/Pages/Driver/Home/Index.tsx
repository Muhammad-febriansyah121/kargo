import TruckIcon from "@/components/customer/icon/truck";
import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import DriverLayout from "@/Layouts/Driver/DriverLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";

interface Props {
    setting: SettingType;
    auth: UserType;
    all: number;
}
export default function Index({ setting, auth, all }: Props) {
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
                    <div className="grid grid-cols-1  gap-5 mt-5">
                        <div className="bg-white mb-20 md:mb-0 p-5 rounded-2xl">
                            <div className="flex flex-col gap-5">
                                <div className="bg-biru rounded-full p-3 flex items-center justify-center w-16 h-16">
                                    <TruckIcon className="text-white size-20" />
                                </div>
                                <div className="mt-3 flex flex-col gap-3">
                                    <h3 className="font-semibold text-2xl">
                                        {all}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Barang Terkirim
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </DriverLayout>
    );
}
