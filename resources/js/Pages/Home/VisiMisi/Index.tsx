import HomeLayout from "@/Layouts/Home/HomeLayout";
import { FAQType } from "@/types/faq";
import { SettingType } from "@/types/setting";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BsQuestionCircleFill } from "react-icons/bs";
import { VisiMisiType } from "@/types/visi_misi";
import { ChartColumnIncreasing } from "lucide-react";

interface Props {
    setting: SettingType;
    data: VisiMisiType;
}
export default function Index({ setting, data }: Props) {
    return (
        <HomeLayout>
            <section className="md:pt-40 pt-32 container ">
                <div className="flex flex-col md:flex-row items-center gap-x-10 gap-y-5 justify-center">
                    <div>
                        <ChartColumnIncreasing
                            className="text-biru text-9xl shrink-0"
                            size={100}
                        />
                    </div>
                    <div className="max-w-md space-y-5 text-center md:text-start">
                        <h1 className="font-bold text-4xl">Visi & Misi</h1>
                        <p className="text-base text-black">
                            Visi dan Misi {setting.site_name}
                        </p>
                    </div>
                </div>
                <Accordion
                    type="single"
                    className="mt-20 space-y-3 bg-white p-5 rounded-2xl"
                    collapsible
                >
                    <AccordionItem value="1">
                        <AccordionTrigger className="text-2xl font-bold">
                            Visi {setting.site_name}
                        </AccordionTrigger>
                        <AccordionContent>
                            <div
                                dangerouslySetInnerHTML={{ __html: data.visi }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion
                    type="single"
                    className="mt-5 space-y-3 bg-white p-5 rounded-2xl"
                    collapsible
                >
                    <AccordionItem value="2">
                        <AccordionTrigger className="text-2xl font-bold">
                            Misi {setting.site_name}
                        </AccordionTrigger>
                        <AccordionContent>
                            <div
                                dangerouslySetInnerHTML={{ __html: data.misi }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </HomeLayout>
    );
}
