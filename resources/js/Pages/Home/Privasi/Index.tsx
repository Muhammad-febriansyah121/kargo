import HomeLayout from "@/Layouts/Home/HomeLayout";
import { KebijakanPrivasiType } from "@/types/kebijakan_privasi";
import { SettingType } from "@/types/setting";
import { TermCondition } from "@/types/term_condition";
import { BiLockAlt, BiShieldQuarter } from "react-icons/bi";

interface Props {
    setting: SettingType;
    data: KebijakanPrivasiType;
}
export default function Index({ setting, data }: Props) {
    return (
        <HomeLayout>
            <section className="md:pt-40 pt-32 container ">
                <div className="flex flex-col md:flex-row items-center gap-x-10 gap-y-5 justify-center">
                    <div>
                        <BiShieldQuarter className="text-biru text-9xl" />
                    </div>
                    <div className="max-w-md space-y-5 text-center md:text-start">
                        <h1 className="font-bold text-4xl">
                            Kebijakan Privasi
                        </h1>
                        <p className="text-base text-black">
                            Penjelasan tentang cara kami mengumpulkan,
                            menggunakan dan melindungi informasi pribadi anda
                            pada Aplikasi kami.
                        </p>
                    </div>
                </div>
                <div className="mt-20 bg-white rounded-2xl p-10 ">
                    <div
                        className="text-base [&_strong]:block [&_strong]:font-bold [&_strong]:mb-5
 [&_ul]:list-decimal [&_ul]:pl-6 [&_li]:mb-2"
                        dangerouslySetInnerHTML={{ __html: data.content }}
                    />
                </div>
            </section>
        </HomeLayout>
    );
}
