import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { TransactionType } from "@/types/transaction";
import { UserType } from "@/types/user";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ShippingOrder, TrackingHistoryType } from "@/types/tracking_history";
import DriverLayout from "@/Layouts/Driver/DriverLayout";
import { ShippingOrderType } from "@/types/shipping_order";

interface Props {
    auth: UserType;
    data: ShippingOrderType;
}
export default function Detail({ auth, data }: Props) {
    return (
        <DriverLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <div className="bg-[#f5f5f5] rounded-2xl p-5 flex flex-col gap-5">
                        <div className="bg-white overflow-auto p-5 rounded-2xl">
                            {data?.barcode && (
                                <div className="text-center mt-10">
                                    <img
                                        src={`/${data.barcode}`}
                                        alt="Barcode"
                                        className="max-w-xs mx-auto mb-5 object-cover border p-2"
                                    />
                                    <a
                                        href={`/${data.barcode}`}
                                        download={`barcode-${
                                            data.tracking_number || "resi"
                                        }.png`}
                                        type="image/png"
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Download Barcode
                                    </a>
                                </div>
                            )}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Table className="shrink-0 border mt-10">
                                    <TableCaption>
                                        Informasi Pengiriman
                                    </TableCaption>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Berat
                                            </TableCell>
                                            <TableCell>
                                                {data.berat} kg
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Panjang
                                            </TableCell>
                                            <TableCell>
                                                {data.panjang} cm
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Tinggi
                                            </TableCell>
                                            <TableCell>
                                                {data.tinggi} cm
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Lebar
                                            </TableCell>
                                            <TableCell>
                                                {data.lebar} cm
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Kota Asal
                                            </TableCell>
                                            <TableCell>
                                                {data.origin_city.kota}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Kota Tujuan
                                            </TableCell>
                                            <TableCell>
                                                {data.destination_city.kota}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Pick Up Type
                                            </TableCell>
                                            <TableCell>
                                                {data.pickup_type}
                                            </TableCell>
                                        </TableRow>
                                        {data.pickup_type === "pickup" && (
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Alamat Pick Up
                                                </TableCell>
                                                <TableCell>
                                                    {data.pickup_address}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Status Pengiriman
                                            </TableCell>
                                            <TableCell>{data.status}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Tgl Pengiriman
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    data.created_at
                                                ).toLocaleDateString("id-ID", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <div>
                                    <Table className="shrink-0 border mt-10">
                                        <TableCaption>
                                            Informasi Pengirim
                                        </TableCaption>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Nama
                                                </TableCell>
                                                <TableCell>
                                                    {data.customer.name}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Nomor Telepon
                                                </TableCell>
                                                <TableCell>
                                                    {data.customer.phone}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Alamat
                                                </TableCell>
                                                <TableCell>
                                                    {data.customer.address}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Table className="shrink-0 border mt-10">
                                        <TableCaption>
                                            Informasi Penerima
                                        </TableCaption>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Penerima
                                                </TableCell>
                                                <TableCell>
                                                    {data.recipient_name}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Nomor Telepon
                                                </TableCell>
                                                <TableCell>
                                                    {data.recipient_phone}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">
                                                    Alamat
                                                </TableCell>
                                                <TableCell>
                                                    {data.recipient_address}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </DriverLayout>
    );
}
