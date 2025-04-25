import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingType } from "@/types/setting";
import { Search } from "lucide-react";

interface Props {
    setting: SettingType;
}
export default function Hero({ setting }: Props) {
    return (
        <section className="relative inset-0 min-h-screen">
            <img
                src={`/storage/${setting.thumbnail}`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="bg-black/35 absolute inset-0"></div>

            {/* Konten tengah */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col gap-1 items-start text-white container">
                    <span className="block text-lg md:text-2xl text-sky-400 font-bold">
                        {setting.tags}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold max-w-md md:max-w-lg">
                        {setting.heading}
                    </h1>
                    <p className="md:text-lg text-base max-w-lg">
                        {setting.description}
                    </p>
                </div>
            </div>

            {/* Grid box di akhir section */}
            <div className="absolute bottom-0  translate-y-96 lg:translate-y-32 left-0 right-0 z-10 container pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="bg-white lg:col-span-1 rounded-2xl p-5 space-y-5">
                        <h3 className="font-bold text-xl text-center">
                            Cek Resi
                        </h3>
                        <form action="" className="flex flex-col gap-3">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Nomor Resi."
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                type="button"
                                className="w-full bg-biru rounded-2xl text-base py-4 font-semibold"
                            >
                                <Search size={19} /> Lacak
                            </Button>
                        </form>
                    </div>
                    <div className="bg-white lg:col-span-2 rounded-2xl p-5 space-y-5">
                        <h3 className="font-bold text-xl text-center">
                            Cek Ongkir
                        </h3>
                        <form
                            action=""
                            className="flex flex-col gap-3 overflow-x-auto"
                        >
                            <div className="flex items-center gap-3 p-4 overflow-x-auto flex-nowrap">
                                <Input
                                    type="text"
                                    placeholder="Kota Tujuan"
                                    className="min-w-[200px]"
                                />
                                <Input
                                    type="text"
                                    placeholder="Kota Tujuan"
                                    className="min-w-[200px]"
                                />
                                <Input
                                    type="number"
                                    placeholder="Berat (Kg)"
                                    className="min-w-[200px]"
                                />
                                <Input
                                    type="number"
                                    placeholder="Dimensi (Cm)"
                                    className="min-w-[200px]"
                                />
                                <Input
                                    type="number"
                                    placeholder="Panjang (Cm)"
                                    className="min-w-[200px]"
                                />
                                <Input
                                    type="number"
                                    placeholder="Lebar (Cm)"
                                    className="min-w-[200px]"
                                />
                                <Input
                                    type="number"
                                    placeholder="Tinggi (Cm)"
                                    className="min-w-[200px]"
                                />
                            </div>

                            <Button
                                type="button"
                                className="w-full bg-biru rounded-2xl text-base py-4 font-semibold"
                            >
                                <Search size={19} /> Lihat Ongkir
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
