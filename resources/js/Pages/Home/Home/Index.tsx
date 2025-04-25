import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HomeLayout from "@/Layouts/Home/HomeLayout";
import { SettingType } from "@/types/setting";
import { ArrowRight, Calendar, Search } from "lucide-react";
import React from "react";
import Hero from "./components/hero";
import MitraKami from "./components/mitra";
import { MitraType } from "@/types/mitra";
import { SectionFiturType } from "@/types/section_fitur";
import SectionFitur from "./components/section_fitur";
import { FiturType } from "@/types/fitur";
import Fitur from "./components/fitur";
import { NewsType } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";
import News from "./components/news";

interface Props {
    setting: SettingType;
    mitra: MitraType[];
    sectionfitur: SectionFiturType;
    fitur: FiturType[];
    news: NewsType[];
}
export default function Index({
    setting,
    mitra,
    sectionfitur,
    fitur,
    news,
}: Props) {
    return (
        <HomeLayout>
            <Hero setting={setting} />
            <section className="lg:pt-40 pt-[28rem] pb-20">
                <MitraKami mitra={mitra} />
            </section>
            <section className="mt-20 bg-white">
                <SectionFitur sectionfitur={sectionfitur} />
            </section>
            <section className="pt-20 container">
                <Fitur fitur={fitur} />
            </section>
            <News news={news} />
        </HomeLayout>
    );
}
