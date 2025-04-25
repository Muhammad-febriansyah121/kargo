import HomeLayout from "@/Layouts/Home/HomeLayout";
import { SettingType } from "@/types/setting";
import { CategoryNews, NewsType } from "@/types/news";
import CardDetail from "./components/card_detail";

interface Props {
    setting: SettingType;
    data: NewsType;
    recent: NewsType[];
    category: CategoryNews[];
}
export default function Detail({ setting, data }: Props) {
    return (
        <HomeLayout>
            <section className="pt-40 container ">
                <CardDetail setting={setting} data={data} />
            </section>
        </HomeLayout>
    );
}
