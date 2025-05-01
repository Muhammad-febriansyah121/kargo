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
                                className="max-w-xs w-full h-24 mx-auto mt-10 mb-5 object-cover"
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
                            <Link
                                href={`/customers/detailriwayatpengiriman/${item.invoice_number}`}
                            >
                                <Button className="bg-amber-500">
                                    <svg
                                        fill="#000000"
                                        viewBox="0 0 32 32"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g
                                            id="SVGRepo_bgCarrier"
                                            strokeWidth="0"
                                        ></g>
                                        <g
                                            id="SVGRepo_tracerCarrier"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <title>eye</title>
                                            <path d="M0 16q0.064 0.128 0.16 0.352t0.48 0.928 0.832 1.344 1.248 1.536 1.664 1.696 2.144 1.568 2.624 1.344 3.136 0.896 3.712 0.352 3.712-0.352 3.168-0.928 2.592-1.312 2.144-1.6 1.664-1.632 1.248-1.6 0.832-1.312 0.48-0.928l0.16-0.352q-0.032-0.128-0.16-0.352t-0.48-0.896-0.832-1.344-1.248-1.568-1.664-1.664-2.144-1.568-2.624-1.344-3.136-0.896-3.712-0.352-3.712 0.352-3.168 0.896-2.592 1.344-2.144 1.568-1.664 1.664-1.248 1.568-0.832 1.344-0.48 0.928zM10.016 16q0-2.464 1.728-4.224t4.256-1.76 4.256 1.76 1.76 4.224-1.76 4.256-4.256 1.76-4.256-1.76-1.728-4.256zM12 16q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848-1.184-2.816-2.816-1.184-2.816 1.184l2.816 2.816h-4z"></path>
                                        </g>
                                    </svg>
                                </Button>
                            </Link>
                            <a
                                href={`/customers/downloadBarcode/${item.invoice_number}`}
                                target="_blank"
                            >
                                <Button className="bg-biru">
                                    <Download size={20} />
                                </Button>
                            </a>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
