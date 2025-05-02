import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/transaction";
import { Link } from "@inertiajs/react";
import { Download } from "lucide-react";

interface Props {
    trx: TransactionType[];
}
export default function TableRiwayat({ trx }: Props) {
    return (
        <Table>
            <TableCaption>Data riwayat pengiriman Anda.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Qr Code</TableHead>
                    <TableHead>Resi</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status Pembayaran</TableHead>
                    <TableHead>Metode Pengiriman</TableHead>
                    <TableHead>Status Pengiriman</TableHead>
                    <TableHead>Tgl Transaksi</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {trx.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            <img
                                src={`/${item.shipping_order.barcode}`}
                                alt="QR Code"
                                className="max-w-xs w-24 h-24 mx-auto mt-10 mb-5 object-cover"
                            />
                        </TableCell>
                        <TableCell>{item.invoice_number || "N/A"}</TableCell>
                        <TableCell>
                            {item.amount
                                ? new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                  }).format(item.amount)
                                : "Rp 0"}{" "}
                        </TableCell>
                        <TableCell>
                            <Badge
                                className={
                                    item.status === "cancel"
                                        ? "bg-red-500 text-white"
                                        : item.status === "paid"
                                        ? "bg-blue-500 text-white"
                                        : item.status === "pending"
                                        ? "bg-yellow-500 text-black"
                                        : "bg-gray-500 text-white" // Default jika status tidak ditemukan
                                }
                            >
                                {item.status || "Unknown"}
                            </Badge>{" "}
                        </TableCell>
                        <TableCell>
                            <Badge
                                className={
                                    item.shipping_order.pickup_type === "pickup"
                                        ? "bg-amber-500 text-white"
                                        : item.shipping_order.pickup_type ===
                                          "dropoff"
                                        ? "bg-teal-500 text-white"
                                        : "bg-gray-300 text-black" // Default jika tidak pickup atau dropoff
                                }
                            >
                                {item.shipping_order.pickup_type}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className="bg-biru text-center mb-3">
                                {item.shipping_order.status === "order_baru"
                                    ? "Order Baru"
                                    : item.shipping_order.status === "pickup"
                                    ? "Pickup"
                                    : item.shipping_order.status ===
                                      "in_transit"
                                    ? "In Transit"
                                    : item.shipping_order.status === "dikirim"
                                    ? "Dikirim"
                                    : item.shipping_order.status ===
                                      "on_delivery"
                                    ? "On Delivery"
                                    : item.shipping_order.status ===
                                      "pengiriman_gudang"
                                    ? "Pengiriman Gudang"
                                    : item.shipping_order.status === "delivered"
                                    ? "Delivered"
                                    : item.shipping_order.status === "selesai"
                                    ? "Selesai"
                                    : item.shipping_order.status === "cancelled"
                                    ? "Cancelled"
                                    : "Unknown"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {item.created_at
                                ? new Date(item.created_at).toLocaleDateString(
                                      "id-ID",
                                      {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      }
                                  )
                                : "N/A"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                            {item.shipping_order.status === "delivered" && (
                                <Link
                                    href={`/customers/selesai/${item.invoice_number}`}
                                    onClick={(e) => {
                                        e.preventDefault(); // Mencegah link diikuti langsung
                                        const isConfirmed = window.confirm(
                                            "Apakah Anda yakin ingin menandai pesanan sebagai selesai?"
                                        );
                                        if (isConfirmed) {
                                            window.location.href = `/customers/selesai/${item.invoice_number}`;
                                        }
                                    }}
                                >
                                    <Button className="bg-biru">
                                        Pesanan Selesai
                                    </Button>
                                </Link>
                            )}
                            <Link
                                href={`/customers/detailriwayatpengiriman/${item.invoice_number}`}
                            >
                                <Button className="bg-amber-500">Detail</Button>
                            </Link>
                            <a
                                href={`/customers/downloadBarcode/${item.invoice_number}`}
                                target="_blank"
                            >
                                <Button className="bg-green-500">
                                    Dowload Resi
                                </Button>
                            </a>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
