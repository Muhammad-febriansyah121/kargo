import KurirLayout from "@/Layouts/Kurir/KurirLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShippingOrderType } from "@/types/shipping_order";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import PickUpTable from "./components/pickup";
import TableAll from "./components/all";
import TableDropoff from "./components/dropoff";
import TablePickup from "./components/pickup";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

interface Props {
    setting: SettingType;
    auth: UserType;
    pickup: ShippingOrderType[];
    pengantaran: ShippingOrderType[];
    all: ShippingOrderType[];
}
export default function Index({
    setting,
    auth,
    pickup,
    pengantaran,
    all,
}: Props) {
    return (
        <KurirLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10">
                    <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl">
                        <Tabs defaultValue="pickup">
                            <TabsList>
                                <TabsTrigger value="pickup">
                                    Pick Up
                                </TabsTrigger>
                                <TabsTrigger value="dropoff">
                                    Pengantaran
                                </TabsTrigger>
                                {/* <TabsTrigger value="end">Selesai</TabsTrigger> */}
                            </TabsList>
                            <TabsContent value="pickup">
                                <TablePickup pickup={pickup} />
                            </TabsContent>
                            <TabsContent value="dropoff">
                                <TableDropoff dropoff={pengantaran} />
                            </TabsContent>
                            {/* <TabsContent value="end">
                                <TableAll all={all} />
                            </TabsContent> */}
                        </Tabs>
                    </div>
                </div>
            </section>
        </KurirLayout>
    );
}
