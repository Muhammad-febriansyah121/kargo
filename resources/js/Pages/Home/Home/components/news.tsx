import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsType } from "@/types/news";
import { Link } from "@inertiajs/react";
import { ArrowRight, Calendar } from "lucide-react";

interface Props {
    news: NewsType[];
}
export default function News({ news }: Props) {
    return (
        <section className="pt-20 container">
            <h1 className="font-bold text-2xl text-center mb-10 md:text-4xl">
                Berita Terbaru
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((item) => (
                    <div className="bg-white rounded-2xl p-5" key={item.id}>
                        <img
                            src={`/storage/${item.image}`}
                            alt=""
                            className="bg-cover rounded-2xl mb-5 h-64 w-full hover:shadow-md hover:scale-110 transition-all duration-300"
                        />
                        <div className="flex items-center justify-between mb-5 gap-2">
                            <span className="flex items-center text-sm text-gray-500 gap-1.5">
                                <Calendar size={19} />{" "}
                                {new Date(item.created_at).toLocaleDateString(
                                    "id-ID",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
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
                                    Baca Selengkapnya
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full mt-10 justify-center items-center flex">
                <Link href="/home/news/">
                    <Button className="bg-biru text-white rounded-2xl inline-flex items-center gap-2">
                        Lihat Berita Lainnya{" "}
                    </Button>
                </Link>
            </div>
        </section>
    );
}
