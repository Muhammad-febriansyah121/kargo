import { useEffect, useState } from "react";
import axios from "axios";
import { ShippingOrderType } from "@/types/shipping_order";
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
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Eye } from "lucide-react";

interface Props {
    pickup: ShippingOrderType[];
}
export default function TablePickup({ pickup }: Props) {
    return (
        <Table>
            <TableCaption>Data Pengiriman.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Resi</TableHead>
                    <TableHead>Tgl</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pickup.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.tracking_number || "N/A"}</TableCell>
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
                                href={`/kurir/detailpengiriman/${item.tracking_number}`}
                            >
                                <Button className="bg-amber-500">Detail</Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
