interface Props {
    icon: any;
    title: string;
    desc: string;
}
export default function CardContact({ icon, title, desc }: Props) {
    return (
        <div className="flex items-start gap-5">
            <div className="bg-biru/50 rounded-full p-3.5">{icon}</div>
            <div className="flex flex-col gap-1.5">
                <h6 className="font-bold text-xl">{title}</h6>
                <p className="text-base leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
