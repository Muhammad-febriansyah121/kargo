import HomeIcon from "@/components/customer/icon/home";
import ProfileIcon from "@/components/customer/icon/profile";
import RiwayatIcon from "@/components/customer/icon/riwayat";
import TruckIcon from "@/components/customer/icon/truck";
import ScanIcon from "@/components/driver/icons/scan";

export const UrlKurir = [
    {
        id: 1,
        url: "/kurir/home",
        name: "Home",
        icon: <HomeIcon className="w-6 h-6" />,
    },
    {
        id: 2,
        url: "/kurir/scan",
        name: "Scan Barang",
        icon: <ScanIcon className="w-6 h-6" />,
    },
    {
        id: 3,
        url: "/kurir/pengiriman",
        name: "Pengiriman",
        icon: <RiwayatIcon className="w-6 h-6" />,
    },
    {
        id: 4,
        url: "/kurir/profile",
        name: "Akun",
        icon: <ProfileIcon className="w-6 h-6" />,
    },
];
