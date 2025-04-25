import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";

interface Props {
    setting: SettingType;
    auth: UserType;
}
export default function Index({ setting, auth }: Props) {
    return (
        <CustomerLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Ipsa et in porro molestiae debitis veniam, eveniet iusto
                    distinctio illo at possimus odit sint asperiores dignissimos
                    nostrum aliquid dolores sed perspiciatis incidunt rerum!
                    Soluta numquam a commodi ut, totam cumque pariatur unde
                    laudantium animi perspiciatis delectus id odit sint, hic,
                    sequi quasi minima sed laboriosam omnis expedita. Optio,
                    nulla illum sunt mollitia culpa magnam voluptatem,
                    accusantium veritatis accusamus quam suscipit minima fuga
                    dolores consectetur veniam odio delectus saepe quaerat
                    quidem nostrum vel. Commodi aperiam id dolor ab, cupiditate
                    aut enim, rerum aliquam soluta, numquam cum ratione
                    accusantium incidunt perferendis cumque doloribus.
                </div>
            </section>
        </CustomerLayout>
    );
}
