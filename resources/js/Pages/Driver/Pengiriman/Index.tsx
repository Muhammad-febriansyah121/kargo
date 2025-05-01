import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import DriverLayout from "@/Layouts/Driver/DriverLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
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
import { ShippingOrderType } from "@/types/shipping_order";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Download } from "lucide-react";

interface Props {
    setting: SettingType;
    auth: UserType;
    data: ShippingOrderType[];
}
export default function Index({ setting, auth, data }: Props) {
    return (
        <DriverLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10">
                    <div className="bg-white rounded-2xl p-5">
                        <Table>
                            <TableCaption>
                                Data riwayat pengiriman Anda.
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Qr Code</TableHead>
                                    <TableHead>Resi</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <img
                                                src={`/${item.barcode}`}
                                                alt="QR Code"
                                                className="max-w-xs w-24 h-24 mx-auto mt-10 mb-5 object-cover"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.tracking_number || "N/A"}
                                        </TableCell>
                                        {/* <TableCell>
                            {item.amount
                                ? new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                  }).format(item.amount)
                                : "Rp 0"}{" "}
                        </TableCell> */}

                                        <TableCell className="flex gap-2">
                                            <Link
                                                href={`/driver/detailpengiriman/${item.tracking_number}`}
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
                                                href={`/customers/downloadBarcode/${item.tracking_number}`}
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
                    </div>
                </div>
            </section>
        </DriverLayout>
    );
}
