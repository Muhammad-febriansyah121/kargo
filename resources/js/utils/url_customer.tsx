import HomeIcon from "@/components/customer/icon/home";
import ProfileIcon from "@/components/customer/icon/profile";
import RiwayatIcon from "@/components/customer/icon/riwayat";
import TruckIcon from "@/components/customer/icon/truck";

export const UrlCustomer = [
    {
        id: 1,
        url: "/customers/home",
        name: "Home",
        icon: <HomeIcon className="w-6 h-6" />,
    },
    {
        id: 2,
        url: "/customers/kirimbarang",
        name: "Kirim",
        icon: <TruckIcon className="w-6 h-6" />,
    },
    {
        id: 3,
        url: "/customers/riwayatpengiriman",
        name: "Riwayat",
        icon: <RiwayatIcon className="w-6 h-6" />,
    },
    {
        id: 4,
        url: "/customers/profile",
        name: "Akun",
        icon: <ProfileIcon className="w-6 h-6" />,
    },
];
