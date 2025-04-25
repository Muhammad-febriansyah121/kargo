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

interface Props {
    setting: SettingType;
    faq: FAQType[];
}
export default function Index({ setting, faq }: Props) {
    return (
        <HomeLayout>
            <section className="md:pt-40 pt-32 container ">
                <div className="flex flex-col md:flex-row items-center gap-x-10 gap-y-5 justify-center">
                    <div>
                        <BsQuestionCircleFill className="text-biru text-9xl" />
                    </div>
                    <div className="max-w-md space-y-5 text-center md:text-start">
                        <h1 className="font-bold text-4xl">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-base text-black">
                            Temukan jawaban dari berbagai pertanyaan yang sering
                            diajukan
                        </p>
                    </div>
                </div>
                <Accordion
                    type="single"
                    className="mt-20 space-y-3 bg-white p-5 rounded-2xl"
                    collapsible
                >
                    {faq.map((item) => (
                        <AccordionItem value={item.id.toString()} key={item.id}>
                            <AccordionTrigger>{item.question}</AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </HomeLayout>
    );
}
