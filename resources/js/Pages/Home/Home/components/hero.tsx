import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingType } from "@/types/setting";
import { Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { TransactionType } from "@/types/transaction";
import { router, useForm } from "@inertiajs/react";
import { ShippingZone } from "@/types/shipping_order";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Inertia } from "@inertiajs/inertia";

interface Props {
    setting: SettingType;
    city: ShippingZone[];
}
export default function Hero({ setting, city }: Props) {
    const [originCity, setOriginCity] = useState("");
    const [destinationCity, setDestinationCity] = useState("");
    const [weight, setWeight] = useState("");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    // Submit handler

    const form = useForm({
        tracking_number: "",
    });

    const cekongkir = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            router.post(
                "/cek-ongkir",
                {
                    origin_city_id: originCity,
                    destination_city_id: destinationCity,
                    berat: Number(weight),
                    panjang: Number(length),
                    lebar: Number(width),
                    tinggi: Number(height),
                },
                {
                    onSuccess: () => {
                        console.log("Cek ongkir berhasil");
                    },
                    onError: (errors) => {
                        console.error("Terjadi error:", errors);
                        // bisa juga setError(errors.field_name) untuk tampilkan error ke user
                    },
                }
            );
        } catch (error) {
            console.error("Error saat request cek ongkir:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.data.tracking_number) return;
        window.location.href = `/cek-resi/${form.data.tracking_number}`;
    };

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
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-3"
                        >
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Nomor Resi."
                                    className="pl-10"
                                    value={form.data.tracking_number}
                                    onChange={(e) =>
                                        form.setData(
                                            "tracking_number",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
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
                            onSubmit={cekongkir}
                            className="flex flex-col gap-3 overflow-x-auto"
                        >
                            <div className="flex items-center gap-3 p-4 overflow-x-auto flex-nowrap">
                                <Select
                                    onValueChange={setOriginCity}
                                    value={originCity}
                                >
                                    <SelectTrigger className="min-w-[200px]">
                                        <SelectValue placeholder="Kota Asal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {city.map((origin) => (
                                            <SelectItem
                                                key={`origin-${origin.origin_city.id}-from`}
                                                value={origin.origin_city.id.toString()}
                                            >
                                                {origin.origin_city.provinsi} -{" "}
                                                {origin.origin_city.kota} -{" "}
                                                {origin.origin_city.kecamatan} -{" "}
                                                {origin.origin_city.kelurahan} -{" "}
                                                {origin.origin_city.postal_code}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    onValueChange={setDestinationCity}
                                    value={destinationCity}
                                >
                                    <SelectTrigger className="min-w-[200px]">
                                        <SelectValue placeholder="Kota Tujuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {city.map((destinasi) => (
                                            <SelectItem
                                                key={`destination-${destinasi.destination_city.id}-to`}
                                                value={destinasi.destination_city.id.toString()}
                                            >
                                                {
                                                    destinasi.destination_city
                                                        .provinsi
                                                }{" "}
                                                -{" "}
                                                {
                                                    destinasi.destination_city
                                                        .kota
                                                }{" "}
                                                -{" "}
                                                {
                                                    destinasi.destination_city
                                                        .kecamatan
                                                }{" "}
                                                {
                                                    destinasi.destination_city
                                                        .kelurahan
                                                }{" "}
                                                -{" "}
                                                {
                                                    destinasi.destination_city
                                                        .postal_code
                                                }
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    type="number"
                                    placeholder="Berat (Kg)"
                                    className="min-w-[200px]"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Panjang (Cm)"
                                    className="min-w-[200px]"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Lebar (Cm)"
                                    className="min-w-[200px]"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Tinggi (Cm)"
                                    className="min-w-[200px]"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>

                            <Button
                                type="submit"
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
