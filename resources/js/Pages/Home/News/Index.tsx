import HomeLayout from "@/Layouts/Home/HomeLayout";
import { SettingType } from "@/types/setting";
import { CategoryNews, NewsType } from "@/types/news";
import TabsCategory from "./components/tabscategory";

interface Props {
    setting: SettingType;
    data: NewsType[];
    recent: NewsType[];
    category: CategoryNews[];
}
export default function Index({ setting, data, recent, category }: Props) {
    return (
        <HomeLayout>
            <section className="pt-40 container ">
                <div className="flex flex-col mb-20 gap-5 items-center">
                    <h1 className="font-bold text-4xl">Berita Lainnya</h1>
                    <p className="text-gray-500 text-base text-center md:text-start">
                        Informasi, kabar dan cerita terkini {setting.site_name}{" "}
                        memberikan berbagai dampak sosial
                    </p>
                </div>
                <TabsCategory data={recent} category={category} />
            </section>
        </HomeLayout>
    );
}
