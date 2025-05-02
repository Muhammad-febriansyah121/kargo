import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { CityType } from "@/types/city";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import { ShippingServiceType } from "@/types/shipping_service";
import FormKirimBarang from "./components/form";

interface Props {
    setting: SettingType;
    auth: UserType;
    city: CityType[];
    service: ShippingServiceType[];
}
export default function Index({ setting, auth, city, service }: Props) {
    return (
        <CustomerLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-2xl">
                            Form Kirim Barang
                        </h3>
                        <p className="text-sm text-gray-500">
                            Harap isi form dibawah ini dengan sebenar-benarnya.
                        </p>
                    </div>
                    <div className="bg-white mb-40 md:mb-0 p-5 rounded-2xl">
                        <FormKirimBarang
                            city={city}
                            service={service}
                            auth={auth}
                        />
                    </div>
                </div>
            </section>
        </CustomerLayout>
    );
}
