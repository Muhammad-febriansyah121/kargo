import { CategoryNews, NewsType } from "@/types/news";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

interface Props {
    data: NewsType[];
    category: CategoryNews[];
}

export default function TabsCategory({ data, category }: Props) {
    return (
        <Tabs defaultValue="all" className="items-start py-10">
            <TabsList className="flex py-10 mb-5 space-x-2 overflow-x-auto overflow-y-hidden bg-transparent">
                <TabsTrigger value="all" className="">
                    Semua
                </TabsTrigger>
                {category.map((cat) => (
                    <TabsTrigger key={cat.id} value={cat.slug}>
                        {cat.title}
                    </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((item) => (
                        <div className="bg-white rounded-2xl p-5" key={item.id}>
                            <img
                                src={`/storage/${item.image}`}
                                alt=""
                                className="bg-cover rounded-2xl mb-5 h-64 w-full"
                            />
                            <div className="flex items-center justify-between mb-5 gap-2">
                                <span className="flex items-center text-sm text-gray-500 gap-1.5">
                                    <Calendar size={19} />{" "}
                                    {new Date(
                                        item.created_at
                                    ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                                <Badge className="bg-biru/50 text-black">
                                    {item.category_news.title}
                                </Badge>
                            </div>
                            <h3 className="font-semibold text-lg mb-5">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                            <div className="mt-10">
                                <Link href={"/home/newsdetail/" + item.slug}>
                                    <Button className="bg-biru text-white rounded-2xl">
                                        Baca Selengkapnya <ArrowRight />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
            {/* Tab per Kategori */}
            {category.map((cat) => (
                <TabsContent key={cat.id} value={cat.slug}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data
                            .filter(
                                (item) => item.category_news.slug === cat.slug
                            )
                            .map((item) => (
                                <div
                                    className="bg-white rounded-2xl p-5"
                                    key={item.id}
                                >
                                    <img
                                        src={`/storage/${item.image}`}
                                        alt=""
                                        className="bg-cover rounded-2xl mb-5 h-64 w-full"
                                    />
                                    <div className="flex items-center justify-between mb-5 gap-2">
                                        <span className="flex items-center text-sm text-gray-500 gap-1.5">
                                            <Calendar size={19} />{" "}
                                            {new Date(
                                                item.created_at
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <Badge className="bg-biru/50 text-black">
                                            {item.category_news.title}
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-5">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {item.desc}
                                    </p>
                                    <div className="mt-10">
                                        <Link
                                            href={
                                                "/home/newsdetail/" + item.slug
                                            }
                                        >
                                            <Button className="bg-biru text-white rounded-2xl">
                                                Baca Selengkapnya <ArrowRight />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}
