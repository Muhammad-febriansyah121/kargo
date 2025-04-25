import HomeLayout from "@/Layouts/Home/HomeLayout";
import { SettingType } from "@/types/setting";
import { CategoryNews, NewsType } from "@/types/news";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { BsWhatsapp } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, PhoneCall } from "lucide-react";
import CardContact from "./components/card_contact";
import { BiEnvelope } from "react-icons/bi";

interface Props {
    setting: SettingType;
}
export default function Index({ setting }: Props) {
    return (
        <HomeLayout>
            <section className="lg:pt-40 pt-20 container ">
                <div className="flex flex-col lg:flex-row items-center gap-x-10 gap-y-5 justify-center">
                    <div>
                        <img
                            src="/images/contact.svg"
                            className="w-full bg-cover"
                            alt=""
                        />
                    </div>
                    <div className="max-w-md space-y-5  md:text-start">
                        <h1 className="font-bold text-4xl text-center lg:text-start">
                            Hubungi Kami
                        </h1>
                        <p className="text-base text-black text-center lg:text-start">
                            Kami ingin mengenalmu dan dengan senang hati akan
                            menjawab pertanyaanmu!{" "}
                        </p>
                        <br />
                        <a
                            className="pt-5"
                            href={`https://wa.me/${setting.phone}`}
                            target="_blank"
                        >
                            <Button className="mx-auto lg:mx-0 flex items-center gap-2 rounded-2xl bg-biru text-white">
                                <BsWhatsapp /> Hubungi Kami Sekarang
                            </Button>
                        </a>
                    </div>
                </div>
                <div className="grid grid-cols-1 mt-20 md:grid-cols-2 gap-10 justify-between">
                    <div className="bg-white rounded-2xl p-5">
                        <iframe
                            src={setting.map}
                            frameBorder="0"
                            className="w-full h-[30rem] rounded-2xl"
                        ></iframe>
                    </div>
                    <div className="flex flex-col gap-y-10">
                        <CardContact
                            icon={<MapPin size={25} className="text-biru" />}
                            title="Alamat Kami"
                            desc={setting.address}
                        />
                        <CardContact
                            icon={<Phone size={25} className="text-biru" />}
                            title="Telephone Perusahaan"
                            desc={setting.tel_perusahaan}
                        />
                        <CardContact
                            icon={
                                <BiEnvelope size={25} className="text-biru" />
                            }
                            title="Alamat Email"
                            desc={setting.email}
                        />
                        <CardContact
                            icon={
                                <BsWhatsapp size={25} className="text-biru" />
                            }
                            title="Whatsapp"
                            desc={setting.phone}
                        />
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}
