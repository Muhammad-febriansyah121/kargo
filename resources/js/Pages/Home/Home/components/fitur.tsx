import { FiturType } from "@/types/fitur";
import React from "react";

interface Props {
    fitur: FiturType[];
}
export default function Fitur({ fitur }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-x-5 gap-y-10 relative">
            {fitur.map((item) => (
                <div
                    key={item.id}
                    className="bg-white group hover:bg-biru transition-all duration-300 rounded-2xl flex flex-col items-center p-5"
                >
                    <img
                        src={`/storage/${item.image}`}
                        className="bg-cover w-36 h-[7rem] group-hover:scale-110 transition-all duration-300  object-cover rounded-2xl"
                        alt=""
                    />
                    <div className="space-y-3">
                        <h3 className="font-bold text-xl group-hover:text-white text-biru text-center">
                            {item.title}
                        </h3>
                        <p className="leading-relaxed text-sm text-gray-600 group-hover:text-white text-center">
                            {item.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
