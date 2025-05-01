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

interface Props {
    setting: SettingType;
    auth: UserType;
    pickup: ShippingOrderType[];
    dropoff: ShippingOrderType[];
    all: ShippingOrderType[];
}
export default function Index({ setting, auth, pickup, dropoff, all }: Props) {
    return (
        <KurirLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10">
                    <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl">
                        <Tabs defaultValue="all">
                            <TabsList>
                                <TabsTrigger value="all">Semua</TabsTrigger>
                                <TabsTrigger value="pickup">
                                    Pick Up
                                </TabsTrigger>
                                <TabsTrigger value="dropoff">
                                    Drop Off
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                <TableAll all={all} />
                            </TabsContent>
                            <TabsContent value="pickup">
                                <TablePickup pickup={pickup} />
                            </TabsContent>
                            <TabsContent value="dropoff">
                                <TableDropoff dropoff={dropoff} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>
        </KurirLayout>
    );
}
