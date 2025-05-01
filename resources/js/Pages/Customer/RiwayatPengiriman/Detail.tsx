import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { TransactionType } from "@/types/transaction";
import { UserType } from "@/types/user";

import { TrackingHistoryType } from "@/types/tracking_history";
import DetailRiwayat from "./components/detail_riwayat";

interface Props {
    auth: UserType;
    trx: TransactionType;
    tracking: TrackingHistoryType[];
}
export default function Detail({ auth, trx, tracking }: Props) {
    return (
        <CustomerLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <div className="bg-[#f5f5f5] overflow-auto rounded-2xl p-5 flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-xl md:text-2xl font-semibold">
                                Pesanan Berhasil Dibuat
                            </h1>
                            {trx.status === "pending" && (
                                <p className="text-gray-500 text-sm max-w-xl">
                                    Terima kasih telah memesan layanan kami.
                                    Untuk melanjutkan proses pengiriman, mohon
                                    segera lakukan pembayaran sesuai metode yang
                                    dipilih.
                                </p>
                            )}
                        </div>
                        {trx.shipping_order.delivery_proof && (
                            <div className="bg-white overflow-auto p-5 rounded-2xl">
                                <h3 className="font-bold text-xl mb-3">
                                    Bukti Pengiriman
                                </h3>
                                <img
                                    src={`/storage/${trx.shipping_order.delivery_proof}`}
                                    alt="Barcode"
                                    className="max-w-xs mx-auto rounded-2xl mb-5 object-cover border p-2"
                                />
                            </div>
                        )}
                        <div className="bg-white overflow-auto p-5 rounded-2xl">
                            {trx?.shipping_order?.barcode && (
                                <div className="text-center mt-10">
                                    <img
                                        src={`/${trx.shipping_order.barcode}`}
                                        alt="Barcode"
                                        className="max-w-xs mx-auto mb-5 object-cover border p-2"
                                    />
                                    <a
                                        href={`/${trx.shipping_order.barcode}`}
                                        download={`barcode-${
                                            trx.shipping_order
                                                .tracking_number || "resi"
                                        }.png`}
                                        type="image/png"
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Download Barcode
                                    </a>
                                </div>
                            )}
                        </div>
                        <DetailRiwayat trx={trx} tracking={tracking} />
                    </div>
                </div>
            </section>
        </CustomerLayout>
    );
}
