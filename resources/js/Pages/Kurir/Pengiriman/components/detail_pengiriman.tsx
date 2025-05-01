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
import { ShippingOrderType } from "@/types/shipping_order";

interface Props {
    all: ShippingOrderType;
}
export default function DetailPengiriman({ all }: Props) {
    return (
        <>
            <Table className="shrink-0 ">
                <TableCaption>Invoice Pembayaran</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Barang</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Status Pengiriman</TableHead>
                        <TableHead>Metode Pembayaran</TableHead>
                        <TableHead>Estimasi Pengiriman</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">
                            {all.nama_barang}
                        </TableCell>
                        <TableCell className="font-medium">
                            {all.tracking_number}
                        </TableCell>
                        <TableCell>
                            <Badge
                                className={
                                    all.status === "cancel"
                                        ? "bg-red-500 text-white"
                                        : all.status === "paid"
                                        ? "bg-blue-500 text-white"
                                        : all.status === "pending"
                                        ? "bg-yellow-500 text-black"
                                        : "bg-gray-500 text-white" // Default jika status tidak ditemukan
                                }
                            >
                                {all.status || "Unknown"}
                            </Badge>{" "}
                        </TableCell>
                        <TableCell>{all.payment_method}</TableCell>
                        <TableCell>
                            {new Date(all.estimation_date).toLocaleDateString(
                                "id-ID",
                                {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                }
                            )}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Table className="shrink-0 border mt-10">
                    <TableCaption>Informasi Pengiriman</TableCaption>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Berat</TableCell>
                            <TableCell>{all.berat} kg</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Panjang
                            </TableCell>
                            <TableCell>{all.panjang} cm</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Tinggi
                            </TableCell>
                            <TableCell>{all.tinggi} cm</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Lebar</TableCell>
                            <TableCell>{all.lebar} cm</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Kota Asal
                            </TableCell>
                            <TableCell>{all.origin_city.kota}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Kota Tujuan
                            </TableCell>
                            <TableCell>{all.destination_city.kota}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Pick Up Type
                            </TableCell>
                            <TableCell>{all.pickup_type}</TableCell>
                        </TableRow>
                        {all.pickup_type === "pickup" && (
                            <TableRow>
                                <TableCell className="font-medium">
                                    Alamat Pick Up
                                </TableCell>
                                <TableCell>{all.pickup_address}</TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell className="font-medium">
                                Status
                            </TableCell>
                            <TableCell>{all.status}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">
                                Tgl Pengiriman
                            </TableCell>
                            <TableCell>
                                {new Date(all.created_at).toLocaleDateString(
                                    "id-ID",
                                    {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    }
                                )}
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
                                <TableCell>{all.customer.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    Nomor Telepon
                                </TableCell>
                                <TableCell>{all.customer.phone}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    Alamat
                                </TableCell>
                                <TableCell>{all.customer.address}</TableCell>
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
                                <TableCell>{all.recipient_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    Nomor Telepon
                                </TableCell>
                                <TableCell>{all.recipient_phone}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">
                                    Alamat
                                </TableCell>
                                <TableCell>{all.recipient_address}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
