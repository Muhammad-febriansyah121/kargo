import KurirLayout from "@/Layouts/Kurir/KurirLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import ScanQr from "./components/scan";
import { useEffect, useState } from "react";
import axios from "axios";
import { ShippingOrderType } from "@/types/shipping_order";

interface Props {
    setting: SettingType;
    auth: UserType;
}
export default function Index({ setting, auth }: Props) {
    const [result, setResult] = useState<string | null>(null);
    const [order, setOrder] = useState<ShippingOrderType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("/sanctum/csrf-cookie");
    }, []);

    const handleScan = async (decodedText: string) => {
        setResult(decodedText);
        setError(null);
        setSuccessMsg(null); // Reset pesan sukses
        try {
            const res = await axios.post("/kurir/scan-result", {
                tracking_number: decodedText,
            });
            setOrder(res.data.data);
        } catch (err: any) {
            setOrder(null);
            setError(err.response?.data?.error || "Terjadi kesalahan");
        }
    };
    return (
        <KurirLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 mb-52">
                    <div className="bg-white p-5 rounded-2xl flex flex-col gap-4">
                        <ScanQr onScanSuccess={handleScan} />
                    </div>
                </div>
            </section>
        </KurirLayout>
    );
}
