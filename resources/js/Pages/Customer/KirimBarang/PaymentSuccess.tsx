import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { SettingType } from "@/types/setting";
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
import { TransactionType } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";

interface Props {
    setting: SettingType;
    auth: UserType;
    trx: TransactionType;
    barcode: string;
}
export default function PaymentSuccess({ setting, auth, trx, barcode }: Props) {
    return (
        <CustomerLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <div className="bg-white rounded-2xl p-5 flex flex-col gap-5">
                        <div className="flex justify-center mb-10">
                            <img
                                src="/images/invoice.svg"
                                className="object-cover w-[25rem] h-72"
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="text-xl md:text-2xl font-semibold">
                                Pesanan Berhasil Dibuat
                            </h1>
                            <p className="text-gray-500 text-sm max-w-xl">
                                Terima kasih telah memesan layanan kami. Untuk
                                melanjutkan proses pengiriman, mohon segera
                                lakukan pembayaran sesuai metode yang dipilih.
                            </p>
                        </div>
                        {trx?.shipping_order?.barcode && (
                            <img
                                src={`data:image/png;base64,${trx.shipping_order.barcode}`}
                                alt="QR Code"
                                className="max-w-xs mx-auto mt-10 mb-5 object-cover"
                            />
                        )}

                        <Table className="shrink-0 ">
                            <TableCaption>Invoice Pembayaran</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Barang</TableHead>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Status Pembayaran</TableHead>
                                    <TableHead>Metode Pembayaran</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        {trx.shipping_order.nama_barang}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {trx.invoice_number}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                trx.status === "cancel"
                                                    ? "bg-red-500 text-white"
                                                    : trx.status === "paid"
                                                    ? "bg-blue-500 text-white"
                                                    : trx.status === "pending"
                                                    ? "bg-yellow-500 text-black"
                                                    : "bg-gray-500 text-white" // Default jika status tidak ditemukan
                                            }
                                        >
                                            {trx.status || "Unknown"}
                                        </Badge>{" "}
                                    </TableCell>
                                    <TableCell>{trx.payment_method}</TableCell>
                                    <TableCell className="text-right">
                                        {trx.amount.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
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
                                            {trx.shipping_order.berat} kg
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Panjang
                                        </TableCell>
                                        <TableCell>
                                            {trx.shipping_order.panjang} cm
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Tinggi
                                        </TableCell>
                                        <TableCell>
                                            {trx.shipping_order.tinggi} cm
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Lebar
                                        </TableCell>
                                        <TableCell>
                                            {trx.shipping_order.lebar} cm
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Kota Asal
                                        </TableCell>
                                        <TableCell>
                                            {
                                                trx.shipping_order.origin_city
                                                    .kota
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Kota Tujuan
                                        </TableCell>
                                        <TableCell>
                                            {
                                                trx.shipping_order
                                                    .destination_city.kota
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Pick Up Type
                                        </TableCell>
                                        <TableCell>
                                            {trx.shipping_order.pickup_type}
                                        </TableCell>
                                    </TableRow>
                                    {trx.shipping_order.pickup_type ===
                                        "pickup" && (
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Alamat Pick Up
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    trx.shipping_order
                                                        .pickup_address
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Status Pengiriman
                                        </TableCell>
                                        <TableCell>
                                            {trx.shipping_order.status}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Tgl Pengiriman
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                trx.shipping_order.created_at
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table className="shrink-0 border mt-10">
                                <TableCaption>Informasi Penerima</TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Penerima
                                        </TableCell>
                                        <TableCell>
                                            {trx.shipping_order.recipient_name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Nomor Telepon
                                        </TableCell>
                                        <TableCell>
                                            {trx.shipping_order.recipient_phone}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Alamat
                                        </TableCell>
                                        <TableCell>
                                            {
                                                trx.shipping_order
                                                    .recipient_address
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </section>
        </CustomerLayout>
    );
}
