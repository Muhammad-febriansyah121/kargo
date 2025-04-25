import { CityType } from "@/types/city";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingType } from "@/types/setting";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
    setting: SettingType;
    city: CityType[];
}
export default function FormRegister({ city, setting }: Props) {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selectedItem = city.find((item) => item.id === selectedId);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        store: "",
        city_id: "",
        address: "",
        gender: "",
        "g-recaptcha-response": "",
    });

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            if (!data["g-recaptcha-response"]) {
                toast.error("Harap selesaikan reCAPTCHA.", {
                    position: "top-right",
                    richColors: true,
                });
                return;
            }
            post(route("home.saveregister"), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Pendaftaran anda berhasil disimpan.", {
                        position: "top-right",
                        richColors: true,
                    });
                },
                onError: () => {
                    toast.error("Email ini sudah terdaftar.", {
                        position: "top-right",
                        richColors: true,
                    });
                },
            });
        } catch (error) {
            toast.error("Ada kesalahan saat mengirim pesan. Coba lagi nanti.");
        }
    };
    return (
        <div className="py-10 px-8">
            <div>
                <img
                    src={`/storage/${setting.long_logo}`}
                    className="h-20 w-20 mb-10"
                    alt=""
                />
            </div>
            <form
                onSubmit={handleSubmit}
                className="lg:px-14 lg:py-10 flex flex-col gap-5"
            >
                <h3 className="font-bold text-xl md:text-3xl">
                    Gabung {setting.site_name}
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                    Isi data kamu untuk bergabung di{" "}
                    <strong>{setting.site_name}</strong>
                </p>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="name">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        required
                        name="name"
                        onChange={(e) => setData("name", e.target.value)}
                        value={data.name}
                        placeholder="Nama Lengkap"
                    />
                </div>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        required
                        name="email"
                        onChange={(e) => setData("email", e.target.value)}
                        value={data.email}
                        placeholder="Email"
                    />
                    {errors.email && (
                        <span className="text-sm text-red-600">
                            {errors.email}
                        </span>
                    )}
                </div>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        required
                        onChange={(e) => setData("password", e.target.value)}
                        value={data.password}
                        placeholder="********"
                    />
                </div>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="phone">
                        Nomor Telepon / Whatsapp{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        min={0}
                        id="phone"
                        required
                        name="phone"
                        onChange={(e) => setData("phone", e.target.value)}
                        value={data.phone}
                        placeholder="Nomor Telepon / Whatsapp"
                    />
                </div>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="store">Store </Label>
                    <Input
                        type="text"
                        id="store"
                        name="store"
                        onChange={(e) => setData("store", e.target.value)}
                        value={data.store}
                        placeholder="Nama Toko"
                    />
                </div>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="store">
                        Kota <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between text-sm"
                            >
                                {selectedItem
                                    ? `${selectedItem.provinsi} - ${selectedItem.kota} - ${selectedItem.kecamatan} - ${selectedItem.kelurahan} - ${selectedItem.postal_code}`
                                    : "Pilih Kota Sesuai Alamat Anda"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="md:w-[500px] w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder="Cari kota, kecamatan, dll..." />
                                <CommandEmpty>Tidak ditemukan</CommandEmpty>
                                <CommandGroup>
                                    <CommandList>
                                        {city.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={item.id.toString()}
                                                onSelect={() => {
                                                    setSelectedId(item.id);
                                                    setData(
                                                        "city_id",
                                                        item.id.toString()
                                                    ); // ← Tambahkan ini
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedId === item.id
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                <span className="line-clamp-2 max-w-[400px] block">
                                                    {item.provinsi} -{" "}
                                                    {item.kota} -{" "}
                                                    {item.kecamatan} -{" "}
                                                    {item.kelurahan} -{" "}
                                                    {item.postal_code}
                                                </span>
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="address">
                        Alamat <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="address"
                        required
                        name="address"
                        onChange={(e) => setData("address", e.target.value)}
                        value={data.address}
                        placeholder="Alamat Lengkap"
                    />
                </div>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="address">
                        Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        onValueChange={(value) => setData("gender", value)}
                        value={data.gender}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Jenis Kelamin</SelectLabel>
                                <SelectItem value="Laki-laki">
                                    Laki-laki
                                </SelectItem>
                                <SelectItem value="Perempuan">
                                    Perempuan
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
                    onChange={(token) =>
                        setData("g-recaptcha-response", token ?? "")
                    }
                />

                {errors["g-recaptcha-response"] && (
                    <p className="text-red-500">
                        {errors["g-recaptcha-response"]}
                    </p>
                )}
                <div className="flex items-center space-x-3">
                    <Checkbox id="terms" required />
                    <label
                        htmlFor="terms"
                        className="text-sm leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Dengan mendaftar, kamu setuju dengan Syarat dan
                        Ketentuan yang ada di{" "}
                        <strong className="text-biru">
                            {setting.site_name}
                        </strong>
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    {processing ? (
                        <Button
                            disabled
                            className="w-full rounded-full bg-biru"
                        >
                            <Loader2 className="animate-spin" />
                            Tunggu Sebentar...
                        </Button>
                    ) : (
                        <PulsatingButton type="submit" className="w-full">
                            Registrasi
                        </PulsatingButton>
                    )}
                </div>
                <span className="text-sm text-center">
                    Sudah punya akun?
                    <Link
                        href="/home/login"
                        className="font-bold text-biru ml-1.5"
                    >
                        Masuk
                    </Link>
                </span>
            </form>
        </div>
    );
}
