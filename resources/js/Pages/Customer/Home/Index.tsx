import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import {
    ArrowDownCircleIcon,
    ArrowUpCircleIcon,
    BadgeDollarSignIcon,
    Clock,
} from "lucide-react";
import { BiMoney } from "react-icons/bi";

interface Props {
    setting: SettingType;
    auth: UserType;
    trx: number;
    sudahbayar: number;
    belumbayar: number;
}
export default function Index({
    setting,
    auth,
    trx,
    sudahbayar,
    belumbayar,
}: Props) {
    return (
        <CustomerLayout auth={auth}>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                        <div className="bg-white p-5 rounded-2xl">
                            <div className="flex flex-col gap-4">
                                <div className="bg-biru rounded-full p-3 flex items-center justify-center w-16 h-16">
                                    <BiMoney className="text-white size-20" />
                                </div>
                                <div className="mt-3 flex flex-col gap-3">
                                    <h3 className="font-semibold text-2xl">
                                        {trx}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Total Transaksi
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl">
                            <div className="flex flex-col gap-3">
                                <div className="bg-cyan-600 rounded-full p-3 flex items-center justify-center w-16 h-16">
                                    <BadgeDollarSignIcon className="text-white size-20" />
                                </div>
                                <div className="mt-3 flex flex-col gap-3">
                                    <h3 className="font-semibold text-2xl">
                                        {sudahbayar}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Total Transaksi Sudah Bayar
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white mb-40 md:mb-0 p-5 rounded-2xl">
                            <div className="flex flex-col gap-3">
                                <div className="bg-green-500 rounded-full p-3 flex items-center justify-center w-16 h-16">
                                    <Clock className="text-white size-20" />
                                </div>
                                <div className="mt-3 flex flex-col gap-3">
                                    <h3 className="font-semibold text-2xl">
                                        {belumbayar}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Total Transaksi Belum Bayar
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </CustomerLayout>
    );
}
