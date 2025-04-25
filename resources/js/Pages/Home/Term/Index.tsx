import HomeLayout from "@/Layouts/Home/HomeLayout";
import { SettingType } from "@/types/setting";
import { TermCondition } from "@/types/term_condition";
import { BiSolidErrorCircle } from "react-icons/bi";

interface Props {
    setting: SettingType;
    data: TermCondition;
}
export default function Index({ setting, data }: Props) {
    return (
        <HomeLayout>
            <section className="md:pt-40 pt-32 container ">
                <div className="flex flex-col md:flex-row items-center gap-x-10 gap-y-5 justify-center">
                    <div>
                        <BiSolidErrorCircle className="text-biru text-9xl" />
                    </div>
                    <div className="max-w-md space-y-5 text-center md:text-start">
                        <h1 className="font-bold text-4xl">
                            Term & Conditions
                        </h1>
                        <p className="text-base text-black">
                            Syarat dan ketentuan umum yang berlaku dalam
                            pemakaian layanan {setting.site_name}
                        </p>
                    </div>
                </div>
                <div className="mt-20 bg-white rounded-2xl p-10 ">
                    <div
                        className="text-base [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2"
                        dangerouslySetInnerHTML={{ __html: data.content }}
                    />
                </div>
            </section>
        </HomeLayout>
    );
}
