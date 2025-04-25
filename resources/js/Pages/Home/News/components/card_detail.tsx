import { NewsType } from "@/types/news";
import { SettingType } from "@/types/setting";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
interface Props {
    setting: SettingType;
    data: NewsType;
}
export default function CardDetail({ setting, data }: Props) {
    return (
        <div className="bg-white rounded-2xl p-10 space-y-5">
            <div className="flex items-center gap-5 justify-between">
                <div className="flex items-center gap-5 justify-between">
                    <Link
                        href={"/home/news"}
                        className="flex gap-2 items-center"
                    >
                        <ArrowLeft size={15} />{" "}
                        <span className="text-sm text-biru">Kembali</span>
                    </Link>
                    <div>|</div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/home/news">
                                    Berita
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Detail Berita</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 space-x-3">
                            Penulis
                        </span>
                        <strong className="text-sm">{data.user.name}</strong>
                    </div>
                    •
                    <span className="text-sm text-gray-500">
                        {new Date(data.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>{" "}
                </div>
            </div>
            <div className="flex flex-col gap-y-10 pt-10">
                <h1 className="text-3xl font-bold text-center">{data.title}</h1>
                <img
                    src={`/storage/${data.image}`}
                    className="bg-cover w-full h-[40rem] rounded-2xl transition-all duration-200 hover:scale-110 cursor-pointer"
                    alt=""
                />
            </div>
            <div>
                <p
                    dangerouslySetInnerHTML={{ __html: data.body }}
                    className="mt-10"
                />
            </div>
        </div>
    );
}
