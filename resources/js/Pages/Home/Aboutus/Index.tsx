import HomeLayout from "@/Layouts/Home/HomeLayout";
import { SettingType } from "@/types/setting";
import { BsQuestionCircleFill } from "react-icons/bs";
import { AboutUsType } from "@/types/about_us";

interface Props {
    setting: SettingType;
    data: AboutUsType;
}
export default function Index({ setting, data }: Props) {
    return (
        <HomeLayout>
            <section className="md:pt-40 pt-32 container ">
                <div className="flex flex-col md:flex-row items-center gap-x-10 gap-y-5 justify-center">
                    <div>
                        <img
                            src="/images/about.svg"
                            className="w-full bg-cover"
                            alt=""
                        />

                        {/* <BsQuestionCircleFill className="text-biru text-9xl" /> */}
                    </div>
                    <div className="max-w-md space-y-5 text-center md:text-start">
                        <h1 className="font-bold text-4xl">Tentang Kami</h1>
                        <p className="text-base text-black">{data.title}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl mt-20 p-5 md:p-10">
                    <img
                        src={`/storage/${data.image}`}
                        className="bg-cover w-full h-[20rem] md:h-[40rem] rounded-2xl transition-all duration-200 hover:scale-110 cursor-pointer"
                        alt=""
                    />
                    <p
                        dangerouslySetInnerHTML={{ __html: data.body }}
                        className="mt-10"
                    />
                </div>
            </section>
        </HomeLayout>
    );
}
