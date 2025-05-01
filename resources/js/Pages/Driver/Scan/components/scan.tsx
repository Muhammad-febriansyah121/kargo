import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { ShippingOrderType } from "@/types/shipping_order";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { TransactionType } from "@/types/transaction";
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
    onScanSuccess: (decodedText: string) => void;
}
export default function ScanQr({ onScanSuccess }: Props) {
    const [tracking, setTracking] = useState("");
    const [order, setOrder] = useState<TransactionType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const qrRef = useRef(null);
    useEffect(() => {
        const html5QrCode = new Html5Qrcode("qr-reader");
        Html5Qrcode.getCameras().then((devices) => {
            if (devices && devices.length) {
                html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText) => {
                        handleCari(decodedText);
                        html5QrCode.stop(); // stop setelah berhasil
                    },
                    (errorMessage) => {
                        // console.error(errorMessage);
                    }
                );
            }
        });
    }, []);

    // Tampilkan dialog ketika error
    useEffect(() => {
        if (error) {
            setShowErrorDialog(true);
        }
    }, [error]);

    // Handler cari barang
    const handleCari = async (code: string) => {
        try {
            const res = await axios.post("/scan-result", {
                tracking_number: code,
            });
            setOrder(res.data.data);
            setError(null);
        } catch (err: any) {
            setOrder(null);
            setError("Barang tidak ditemukan");
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl space-y-4">
            <h2 className="text-lg font-bold">Scan atau Cari Barang</h2>
            <div className="flex items-center justify-center rounded-2xl">
                <div
                    id="qr-reader"
                    className="w-full max-w-md md:max-w-xl  rounded-2xl"
                ></div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <Input
                    type="text"
                    placeholder="Masukkan No. Resi"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                />
                <Button type="submit" onClick={() => handleCari(tracking)}>
                    Cari <Search className="w-4 h-4" />
                </Button>
            </div>
            {/* Hasil */}
            <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Error</DialogTitle>
                        <DialogDescription>
                            <img src="/images/404.svg" alt="" />
                            <h3 className="text-center text-xl font-semibold text-black">
                                {error}
                            </h3>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>{" "}
            {order && (
                <div>
                    {order?.shipping_order?.barcode && (
                        <div className="text-center mt-10">
                            <img
                                src={`/${order.shipping_order.barcode}`}
                                alt="Barcode"
                                className="max-w-xs mx-auto mb-5 object-cover border p-2"
                            />
                            <a
                                href={`/${order.shipping_order.barcode}`}
                                download={`barcode-${
                                    order.shipping_order.tracking_number ||
                                    "resi"
                                }.png`}
                                type="image/png"
                                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Download Barcode
                            </a>
                        </div>
                    )}
                    <Table className="shrink-0 ">
                        <TableCaption>Invoice Pembayaran</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Barang</TableHead>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Status Pembayaran</TableHead>
                                <TableHead>Metode Pembayaran</TableHead>
                                <TableHead>Estimasi Pengiriman</TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">
                                    {order.shipping_order.nama_barang}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {order.invoice_number}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            order.status === "cancel"
                                                ? "bg-red-500 text-white"
                                                : order.status === "paid"
                                                ? "bg-blue-500 text-white"
                                                : order.status === "pending"
                                                ? "bg-yellow-500 text-black"
                                                : "bg-gray-500 text-white" // Default jika status tidak ditemukan
                                        }
                                    >
                                        {order.status || "Unknown"}
                                    </Badge>{" "}
                                </TableCell>
                                <TableCell>{order.payment_method}</TableCell>
                                <TableCell>
                                    {new Date(
                                        order.shipping_order.estimation_date
                                    ).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </TableCell>

                                <TableCell className="text-right">
                                    {order.amount.toLocaleString("id-ID", {
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
                                        {order.shipping_order.berat} kg
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Panjang
                                    </TableCell>
                                    <TableCell>
                                        {order.shipping_order.panjang} cm
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Tinggi
                                    </TableCell>
                                    <TableCell>
                                        {order.shipping_order.tinggi} cm
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Lebar
                                    </TableCell>
                                    <TableCell>
                                        {order.shipping_order.lebar} cm
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Kota Asal
                                    </TableCell>
                                    <TableCell>
                                        {order.shipping_order.origin_city.kota}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Kota Tujuan
                                    </TableCell>
                                    <TableCell>
                                        {
                                            order.shipping_order
                                                .destination_city.kota
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Pick Up Type
                                    </TableCell>
                                    <TableCell>
                                        {order.shipping_order.pickup_type}
                                    </TableCell>
                                </TableRow>
                                {order.shipping_order.pickup_type ===
                                    "pickup" && (
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Alamat Pick Up
                                        </TableCell>
                                        <TableCell>
                                            {
                                                order.shipping_order
                                                    .pickup_address
                                            }
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Status
                                    </TableCell>
                                    <TableCell>
                                        {order.shipping_order.status}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Tgl Pengiriman
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            order.shipping_order.created_at
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
                                        {order.shipping_order.recipient_name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Nomor Telepon
                                    </TableCell>
                                    <TableCell>
                                        {order.shipping_order.recipient_phone}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">
                                        Alamat
                                    </TableCell>
                                    <TableCell>
                                        {order.shipping_order.recipient_address}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}
