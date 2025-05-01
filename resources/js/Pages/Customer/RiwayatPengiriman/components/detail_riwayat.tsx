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
import { TrackingHistoryType } from "@/types/tracking_history";
import { TransactionType } from "@/types/transaction";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { ArrowDown, SchoolIcon, StarIcon, WorkflowIcon } from "lucide-react";

interface Props {
    trx: TransactionType;
    tracking: TrackingHistoryType[];
}

export default function DetailRiwayat({ trx, tracking }: Props) {
    return (
        <>
            <div className="bg-white p-5 overflow-auto rounded-2xl">
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
                            <TableHead className="text-right">Total</TableHead>
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
                            <TableCell>
                                {
                                    trx.shipping_order.shipping_rate
                                        .shipping_service.name
                                }
                            </TableCell>
                            <TableCell>
                                {trx.shipping_order.pickup_type}
                            </TableCell>
                            <TableCell>
                                {new Date(
                                    trx.shipping_order.estimation_date
                                ).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </TableCell>

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
                        <TableCaption>Informasi Pengiriman</TableCaption>
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
                                    {trx.shipping_order.origin_city.kota}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    Kota Tujuan
                                </TableCell>
                                <TableCell>
                                    {trx.shipping_order.destination_city.kota}
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
                            {trx.shipping_order.pickup_type === "pickup" && (
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Alamat Pick Up
                                    </TableCell>
                                    <TableCell>
                                        {trx.shipping_order.pickup_address}
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
                    <div>
                        <Table className="shrink-0 border mt-10">
                            <TableCaption>Informasi Pengirim</TableCaption>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Nama
                                    </TableCell>
                                    <TableCell>
                                        {trx.shipping_order.customer.name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Nomor Telepon
                                    </TableCell>
                                    <TableCell>
                                        {trx.shipping_order.customer.phone}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Alamat
                                    </TableCell>
                                    <TableCell>
                                        {trx.shipping_order.customer.address}
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
                                        {trx.shipping_order.recipient_address}
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
                                    : item.status === "pengiriman_gudang"
                                    ? "Pengiriman Gudang"
                                    : item.status === "delivered"
                                    ? "Delivered"
                                    : item.status === "cancelled"
                                    ? "Cancelled"
                                    : "Unknown"}
                            </Badge>
                        </h3>
                        <h4 className="vertical-timeline-element-subtitle">
                            {new Date(item.created_at).toLocaleString("id-ID", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </h4>
                        <p>{item.description}</p>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
            {/* <Table className="shrink-0 mt-10">
                <TableCaption>History Tracking</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Tanggal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tracking.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                <Badge className="bg-biru">
                                    {item.status || "Unknown"}
                                </Badge>{" "}
                            </TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}
        </>
    );
}
