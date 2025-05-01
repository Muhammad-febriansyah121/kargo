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
import { toast } from "sonner";

interface Props {
    onScanSuccess: (decodedText: string) => void;
}
export default function ScanQr({ onScanSuccess }: Props) {
    const [tracking, setTracking] = useState("");
    const [order, setOrder] = useState<TransactionType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [loading, setLoading] = useState(false); // Menambahkan state untuk loading
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
                        handleCari(decodedText); // Panggil handleCari dengan hasil QR scan
                        html5QrCode.stop(); // Stop setelah berhasil scan
                    },
                    (errorMessage) => {
                        console.log(errorMessage); // Untuk debug
                    }
                );
            }
        });
    }, []);
    const handleCari = async (code: string) => {
        try {
            const res = await axios.post("/kurir/scan-result", {
                tracking_number: code,
            });
            setOrder(res.data.data);
            setError(null);
        } catch (err: any) {
            setOrder(null);
            setError("Barang tidak ditemukan");
        }
    };

    const handleKirim = async () => {
        if (!order || !image) {
            alert("Pastikan data dan gambar sudah lengkap.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append(
            "tracking_number",
            order.shipping_order.tracking_number
        );
        formData.append("delivery_proof", image);

        try {
            const res = await axios.post("/kurir/prosesKirim", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.error) {
                toast.error(res.data.error);
            } else {
                toast.success("Barang berhasil dikirim.");
                setOrder(null);
                setImage(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            setShowErrorDialog(true);
        }
    }, [error]);

    useEffect(() => {
        axios.get("/sanctum/csrf-cookie");
    }, []);
    return (
        <div className="bg-white p-5 rounded-xl space-y-4 overflow-auto">
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
                        <div>
                            <Table className="shrink-0 border mt-10">
                                <TableCaption>Informasi Pengirim</TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Pengirim
                                        </TableCell>
                                        <TableCell>
                                            {order.shipping_order.customer.name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Nomor Telepon
                                        </TableCell>
                                        <TableCell>
                                            {
                                                order.shipping_order.customer
                                                    .phone
                                            }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">
                                            Alamat
                                        </TableCell>
                                        <TableCell>
                                            {
                                                order.shipping_order.customer
                                                    .address
                                            }
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
                                            {
                                                order.shipping_order
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
                                                order.shipping_order
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
                                                order.shipping_order
                                                    .recipient_address
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    {(() => {
                        if (order.shipping_order.status === "pickup") {
                            return (
                                <Button
                                    onClick={handleKirim}
                                    disabled={loading}
                                    className={`mt-4 ${
                                        loading ? "bg-gray-400" : "bg-blue-600"
                                    }`}
                                >
                                    {loading
                                        ? "Sedang Mengirim..."
                                        : "Proses Pengiriman"}
                                </Button>
                            );
                        } else if (
                            order.shipping_order.status === "ready_for_delivery"
                        ) {
                            return (
                                <>
                                    {imagePreview && (
                                        <div className="mt-5 pt-5 text-center">
                                            <p className="text-sm text-gray-600 mb-3">
                                                Preview Bukti Pengantaran:
                                            </p>
                                            <div className="flex justify-center">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-72 rounded-2xl border border-gray-300"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="mt-3"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setImage(file);

                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImagePreview(
                                                        reader.result as string
                                                    );
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />

                                    <Button
                                        onClick={handleKirim}
                                        disabled={loading}
                                        className={`mt-4 ${
                                            loading
                                                ? "bg-gray-400"
                                                : "bg-blue-600"
                                        }`}
                                    >
                                        {loading
                                            ? "Sedang Mengirim..."
                                            : "PENGANTARAN"}
                                    </Button>
                                </>
                            );
                        } else {
                            return null; // Atau tampilkan UI fallback
                        }
                    })()}
                </div>
            )}
        </div>
    );
}
