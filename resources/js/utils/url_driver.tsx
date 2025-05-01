import HomeIcon from "@/components/customer/icon/home";
import ProfileIcon from "@/components/customer/icon/profile";
import RiwayatIcon from "@/components/customer/icon/riwayat";
import TruckIcon from "@/components/customer/icon/truck";
import ScanIcon from "@/components/driver/icons/scan";

export const UrlDriver = [
    {
        id: 1,
        url: "/driver/home",
        name: "Home",
        icon: <HomeIcon className="w-6 h-6" />,
    },
    {
        id: 2,
        url: "/driver/scan",
        name: "Scan Barang",
        icon: <ScanIcon className="w-6 h-6" />,
    },
    {
        id: 3,
        url: "/driver/pengiriman",
        name: "Pengiriman",
        icon: <RiwayatIcon className="w-6 h-6" />,
    },
    {
        id: 4,
        url: "/driver/profile",
        name: "Akun",
        icon: <ProfileIcon className="w-6 h-6" />,
    },
];
