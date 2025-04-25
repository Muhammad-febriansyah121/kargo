import { NewsType } from "@/types/news";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Badge } from "@/components/ui/badge";

interface Props {
    recent: NewsType[];
}
export default function Slick({ recent }: Props) {
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    let sliderRef1 = useRef(null);
    let sliderRef2 = useRef(null);

    useEffect(() => {
        setNav1(sliderRef1.current);
        setNav2(sliderRef2.current);
    }, []);
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return <div className="bg-white container p-5 rounded-2xl"></div>;
}
