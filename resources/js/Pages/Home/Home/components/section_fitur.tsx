import { SectionFiturType } from "@/types/section_fitur";

interface Props {
    sectionfitur: SectionFiturType;
}
export default function SectionFitur({ sectionfitur }: Props) {
    return (
        <div className="grid relative grid-cols-1 md:grid-cols-2 items-center justify-items-center gap-10 container mx-auto">
            {/* Gambar */}
            <div className="absolute w-[500px] h-[500px] top-0 -right-44 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 blur-[80px]  rounded-full"></div>
            <div>
                <img
                    src={`/storage/${sectionfitur.image}`}
                    className="bg-cover w-full max-w-md h-[30rem] object-cover rounded-xl"
                    alt=""
                />
            </div>

            {/* Konten */}
            <div className="flex flex-col gap-5 text-center md:text-left max-w-lg">
                <h3 className="font-bold text-4xl">{sectionfitur.title}</h3>
                <p className="leading-relaxed text-sm text-gray-600">
                    {sectionfitur.desc}
                </p>
            </div>
        </div>
    );
}
