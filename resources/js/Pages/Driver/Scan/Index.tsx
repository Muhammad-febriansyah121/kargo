import DriverLayout from "@/Layouts/Driver/DriverLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import ScanQr from "./components/scan";
import { router } from "@inertiajs/react";
import { ShippingOrderType } from "@/types/shipping_order";
import axios from "axios";

interface Props {
    setting: SettingType;
    auth: UserType;
    onScanSuccess: (decodedText: string) => void;
}
export default function Index({ setting, auth, onScanSuccess }: Props) {
    const [result, setResult] = useState<string | null>(null);
    const [order, setOrder] = useState<ShippingOrderType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScan = async (decodedText: string) => {
        setResult(decodedText);
        setError(null);
        try {
            const res = await axios.post("/scan-result", {
                tracking_number: decodedText,
            });
            setOrder(res.data.data);
        } catch (err: any) {
            setOrder(null);
            setError(err.response?.data?.error || "Terjadi kesalahan");
        }
    };
    useEffect(() => {
        axios.get("/sanctum/csrf-cookie");
    }, []);

    return (
        <DriverLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10">
                    <div className="bg-white p-5 rounded-2xl flex flex-col gap-4">
                        <ScanQr onScanSuccess={handleScan} />
                        {result && <p className="mt-4">Hasil scan: {result}</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {order && (
                            <div className="mt-4 border p-4 rounded-lg bg-gray-50">
                                <p>
                                    <strong>Nama Barang:</strong>{" "}
                                    {order.nama_barang}
                                </p>
                                <p>
                                    <strong>Nama Penerima:</strong>{" "}
                                    {order.recipient_name}
                                </p>
                                <p>
                                    <strong>Alamat:</strong>{" "}
                                    {order.recipient_address}
                                </p>
                                <p>
                                    <strong>No. HP:</strong>{" "}
                                    {order.recipient_phone}
                                </p>
                                <p>
                                    <strong>Berat:</strong> {order.berat} kg
                                </p>
                                <img
                                    src={`/${order.barcode}`}
                                    alt="QR Code"
                                    className="w-32 mt-2"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </DriverLayout>
    );
}
