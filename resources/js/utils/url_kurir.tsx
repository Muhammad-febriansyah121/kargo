import HomeIcon from "@/components/customer/icon/home";
import ProfileIcon from "@/components/customer/icon/profile";
import RiwayatIcon from "@/components/customer/icon/riwayat";
import TruckIcon from "@/components/customer/icon/truck";

export const UrlKurir = [
    {
        id: 1,
        url: "/kurir/home",
        name: "Home",
        icon: <HomeIcon className="w-6 h-6" />,
    },
    {
        id: 2,
        url: "/kurir/kirimbarang",
        name: "Scan Barang",
        icon: <TruckIcon className="w-6 h-6" />,
    },
    {
        id: 3,
        url: "/customers/riwayatpengiriman",
        name: "Pengiriman",
        icon: <RiwayatIcon className="w-6 h-6" />,
    },
];
