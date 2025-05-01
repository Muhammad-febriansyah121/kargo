import KurirLayout from "@/Layouts/Kurir/KurirLayout";
import { UserType } from "@/types/user";
import DetailPengiriman from "./components/detail_pengiriman";
import { ShippingOrderType } from "@/types/shipping_order";

interface Props {
    all: ShippingOrderType;
    auth: UserType;
}
export default function Detail({ all, auth }: Props) {
    return (
        <KurirLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <div className="bg-white rounded-2xl overflow-auto mb-40 md:mb-0 p-5 flex flex-col gap-5">
                        <div className="text-center mt-10">
                            <img
                                src={`/${all.barcode}`}
                                alt="Barcode"
                                className="max-w-xs mx-auto mb-5 object-cover border p-2"
                            />
                            <a
                                href={`/${all.barcode}`}
                                download={`barcode-${
                                    all.tracking_number || "resi"
                                }.png`}
                                type="image/png"
                                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Download Barcode
                            </a>
                        </div>
                        <DetailPengiriman all={all} />
                    </div>
                </div>
            </section>{" "}
        </KurirLayout>
    );
}
