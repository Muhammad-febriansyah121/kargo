import HomeLayout from "@/Layouts/Home/HomeLayout";
import { FAQType } from "@/types/faq";
import { SettingType } from "@/types/setting";
import { DefinisiType } from "@/types/definisi";
import { BiClipboard } from "react-icons/bi";

interface Props {
    setting: SettingType;
    data: DefinisiType[];
}
export default function Index({ setting, data }: Props) {
    return (
        <HomeLayout>
            <section className="md:pt-40 pt-32 container ">
                <div className="flex flex-col md:flex-row items-center gap-x-10 gap-y-5 justify-center">
                    <div>
                        <BiClipboard className="text-biru text-9xl" />
                    </div>
                    <div className="max-w-md space-y-5 text-center md:text-start">
                        <h1 className="font-bold text-4xl">Definisi</h1>
                        <p className="text-base text-black">
                            Istilah-istilah umum yang digunakan oleh{" "}
                            {setting.site_name}
                        </p>
                    </div>
                </div>
                <div className="mt-20 p-5 bg-white overflow-x-auto rounded-2xl">
                    <table className="w-full ">
                        <thead className="bg-blue-200 text-xl text-gray-700">
                            <tr>
                                <th className="py-4 px-6 text-center">
                                    Istilah
                                </th>
                                <th className="py-4 px-6 text-center">
                                    Definisi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-4 px-6 text-center font-semibold">
                                        {item.istilah}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {item.definisi}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </HomeLayout>
    );
}
