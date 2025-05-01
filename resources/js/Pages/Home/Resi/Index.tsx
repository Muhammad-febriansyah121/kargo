import HomeLayout from "@/Layouts/Home/HomeLayout";
import { KebijakanPrivasiType } from "@/types/kebijakan_privasi";
import { SettingType } from "@/types/setting";
import { TermCondition } from "@/types/term_condition";
import { TrackingHistoryType } from "@/types/tracking_history";
import { TransactionType } from "@/types/transaction";
import { ArrowDown, BookCheckIcon } from "lucide-react";
import { BiLockAlt, BiShieldQuarter } from "react-icons/bi";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
    setting: SettingType;
    result: TransactionType;
    tracking: TrackingHistoryType[];
}
export default function Index({ setting, result, tracking }: Props) {
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
                        <h1 className="font-bold text-4xl">Resi Pengiriman</h1>
                        <p className="text-base text-black">
                            Hasil pencarian resi pengiriman anda.
                        </p>
                    </div>
                </div>
                <div className="mt-20 rounded-2xl p-10 ">
                    {result.shipping_order.delivery_proof && (
                        <div className="bg-white p-5 rounded-2xl">
                            <h3 className="font-bold text-xl mb-3">
                                Bukti Pengiriman
                            </h3>
                            <img
                                src={`/storage/${result.shipping_order.delivery_proof}`}
                                alt="Barcode"
                                className="max-w-xs mx-auto rounded-2xl mb-5 object-cover border p-2"
                            />
                        </div>
                    )}
                    <div className="bg-white p-5 rounded-2xl">
                        {result?.shipping_order?.barcode && (
                            <div className="text-center mt-10">
                                <img
                                    src={`/${result.shipping_order.barcode}`}
                                    alt="Barcode"
                                    className="max-w-xs mx-auto mb-5 object-cover border p-2"
                                />
                                <a
                                    href={`/${result.shipping_order.barcode}`}
                                    download={`barcode-${
                                        result.shipping_order.tracking_number ||
                                        "resi"
                                    }.png`}
                                    type="image/png"
                                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Download Barcode
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-5 rounded-2xl">
                        <Table className="shrink-0">
                            <TableCaption>Invoice Pembayaran</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Barang</TableHead>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Status Pembayaran</TableHead>
                                    <TableHead>Metode Pembayaran</TableHead>
                                    <TableHead>Jenis Pengiriman</TableHead>
                                    <TableHead>Metode Pengiriman</TableHead>
                                    <TableHead>Estimasi Pengiriman</TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        {result.shipping_order.nama_barang}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {result.invoice_number}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                result.status === "cancel"
                                                    ? "bg-red-500 text-white"
                                                    : result.status === "paid"
                                                    ? "bg-blue-500 text-white"
                                                    : result.status ===
                                                      "pending"
                                                    ? "bg-yellow-500 text-black"
                                                    : "bg-gray-500 text-white" // Default jika status tidak ditemukan
                                            }
                                        >
                                            {result.status || "Unknown"}
                                        </Badge>{" "}
                                    </TableCell>
                                    <TableCell>
                                        {result.payment_method}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            result.shipping_order.shipping_rate
                                                .shipping_service.name
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {result.shipping_order.pickup_type}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            result.shipping_order.estimation_date
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {result.amount.toLocaleString("id-ID", {
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
                                            {result.shipping_order.berat} kg
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Panjang
                                        </TableCell>
                                        <TableCell>
                                            {result.shipping_order.panjang} cm
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Tinggi
                                        </TableCell>
                                        <TableCell>
                                            {result.shipping_order.tinggi} cm
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Lebar
                                        </TableCell>
                                        <TableCell>
                                            {result.shipping_order.lebar} cm
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Kota Asal
                                        </TableCell>
                                        <TableCell>
                                            {
                                                result.shipping_order
                                                    .origin_city.kota
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Kota Tujuan
                                        </TableCell>
                                        <TableCell>
                                            {
                                                result.shipping_order
                                                    .destination_city.kota
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Pick Up Type
                                        </TableCell>
                                        <TableCell>
                                            {result.shipping_order.pickup_type}
                                        </TableCell>
                                    </TableRow>
                                    {result.shipping_order.pickup_type ===
                                        "pickup" && (
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Alamat Pick Up
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    result.shipping_order
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
                                            {result.shipping_order.status}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Tgl Pengiriman
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                result.shipping_order.created_at
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
                                                {
                                                    result.shipping_order
                                                        .customer.name
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Nomor Telepon
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    result.shipping_order
                                                        .customer.phone
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Alamat
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    result.shipping_order
                                                        .customer.address
                                                }
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
                                                {
                                                    result.shipping_order
                                                        .recipient_name
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Nomor Telepon
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    result.shipping_order
                                                        .recipient_phone
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">
                                                Alamat
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    result.shipping_order
                                                        .recipient_address
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <VerticalTimeline>
                        {tracking.map((item, index) => (
                            <VerticalTimelineElement
                                key={index}
                                className="vertical-timeline-element--work rounded-2xl"
                                contentStyle={{
                                    background: "#2347F9",
                                    borderRadius: "20px",
                                    color: "#fff",
                                }}
                                contentArrowStyle={{
                                    borderRight: "7px solid  #2347F9",
                                }}
                                iconStyle={{
                                    background: "#2347F9",
                                    color: "#fff",
                                }}
                                icon={<ArrowDown />}
                            >
                                <h3 className="vertical-timeline-element-title">
                                    <Badge className="bg-red-400 mb-3">
                                        {item.status === "order_baru"
                                            ? "Order Baru"
                                            : item.status === "pickup"
                                            ? "Pickup"
                                            : item.status === "in_transit"
                                            ? "In Transit"
                                            : item.status === "dikirim"
                                            ? "Dikirim"
                                            : item.status === "on_delivery"
                                            ? "On Delivery"
                                            : item.status ===
                                              "pengiriman_gudang"
                                            ? "Pengiriman Gudang"
                                            : item.status === "delivered"
                                            ? "Delivered"
                                            : item.status === "cancelled"
                                            ? "Cancelled"
                                            : "Unknown"}
                                    </Badge>
                                </h3>
                                <h4 className="vertical-timeline-element-subtitle">
                                    {new Date(item.created_at).toLocaleString(
                                        "id-ID",
                                        {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }
                                    )}
                                </h4>
                                <p>{item.description}</p>
                            </VerticalTimelineElement>
                        ))}
                    </VerticalTimeline>
                </div>
            </section>
        </HomeLayout>
    );
}
