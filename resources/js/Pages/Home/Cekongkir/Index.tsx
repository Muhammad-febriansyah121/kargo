import { usePage } from "@inertiajs/react";
import { SettingType } from "@/types/setting";
import { ArrowDown, BookCheckIcon } from "lucide-react";
import HomeLayout from "@/Layouts/Home/HomeLayout";
import { CityType } from "@/types/city";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Props {
    setting: SettingType;
    form: {
        origin_city_id: string;
        destination_city_id: string;
        berat: number;
        panjang: number;
        lebar: number;
        tinggi: number;
    };
    services: {
        id: number;
        name: string;
        desc: string;
        price: number;
    }[];
    error?: string;
}

export default function Index({ setting, form, services }: Props) {
    return (
        <HomeLayout>
            <section className="md:pt-40 pt-32 container ">
                <div className="flex flex-col md:flex-row items-center gap-x-10 gap-y-5 justify-center">
                    <div>
                        <BookCheckIcon
                            className="text-biru text-9xl shrink-0"
                            size={100}
                        />
                    </div>
                    <div className="max-w-md space-y-5 text-center md:text-start">
                        <h1 className="font-bold text-4xl">
                            Cek Ongkir Pengiriman
                        </h1>
                        <p className="text-base text-black">
                            Hasil pencarian ongkir pengiriman.
                        </p>
                    </div>
                </div>
                <div className="mt-20 rounded-2xl p-10 ">
                    <div className="p-5 space-y-3 bg-white rounded-2xl">
                        {services.length > 0 && (
                            <Table>
                                <TableCaption>
                                    Layana Pengiriman Tersedia.
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Jenis Pengiriman</TableHead>
                                        <TableHead>Estimasi Waktu</TableHead>
                                        <TableHead className="text-right">
                                            Harga
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services.map((item, index) => (
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.desc}</TableCell>
                                            <TableCell className="text-right">
                                                {item.price.toLocaleString(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                    }
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}
