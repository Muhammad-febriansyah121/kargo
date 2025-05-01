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
import { CityType } from "@/types/city";
import { ProfileFormData, UserType } from "@/types/user";
import { FormEventHandler, useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { WareHouseType } from "@/types/warehouse";

interface Props {
    city: CityType[];
    user: UserType;
    warehouse: WareHouseType[];
}
export default function FormProfileKurir({ city, user, warehouse }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const selectedItem = city.find((item) => {
        return item.id === selectedId;
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, progress, processing, reset, errors } =
        useForm<ProfileFormData>({
            name: user.name ?? "",
            email: user.email ?? "",
            password: "",
            phone: user.phone ?? "",
            store: "",
            city_id: user.city_id ? String(user.city_id) : "",
            address: user.address ?? "",
            gender: user.gender ?? "",
            vehicle_type: user.vehicle_type ?? "",
            vehicle_number: user.vehicle_number ?? "",
            warehouse_id: user.warehouse_id ? String(user.warehouse_id) : "",
            role: user.role,
            image: null,
        });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("kurir.updateprofile"), {
            onSuccess: () => {
                toast.success("Profile berhasil diperbarui!", {
                    position: "top-right",
                });

                // Tunggu 1 detik supaya toast muncul dulu
                setTimeout(() => {
                    Inertia.reload();
                }, 2000);
            },
            onError: (errors) => {
                console.log(errors);
                toast.error("Ada kesalahan sistem!", {
                    position: "top-right",
                });
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl); // Update preview with the selected file
            setData((prevData) => ({
                ...prevData,
                image: file,
            }));
        }
    };
    useEffect(() => {
        if (user.image) {
            setImagePreview(`/storage/${user.image}`); // Update the preview with the current image URL
        }
    }, [user.image]);
    useEffect(() => {
        if (user.city_id) {
            setSelectedId(Number(user.city_id)); // ← Pastikan selectedId berupa number
        }
    }, [user.city_id]);
    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 :grid-cols-3"
        >
            <div className="grid grid-cols-1 gap-y-5 lg:gap-x-5 lg:grid-cols-3 mb-40 lg:mb-0">
                <div className="col-span-1 px-6 py-5 space-y-5 bg-white overflow-auto lg:col-span-2 rounded-2xl">
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            onChange={(e) => setData("name", e.target.value)}
                            value={data.name}
                            placeholder="Nama Lengkap"
                        />
                    </div>
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
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
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            value={data.password}
                            placeholder="********"
                        />
                    </div>
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="phone">Nomor Telepon / Whatsapp </Label>
                        <Input
                            type="number"
                            min={0}
                            id="phone"
                            name="phone"
                            onChange={(e) => setData("phone", e.target.value)}
                            value={data.phone}
                            placeholder="Nomor Telepon / Whatsapp"
                        />
                    </div>
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="address">Jenis Kelamin </Label>
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
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="store">Kota</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between text-sm"
                                >
                                    {selectedItem
                                        ? `${selectedItem.provinsi} - ${selectedItem.kota} - ${selectedItem.kecamatan} - ${selectedItem.kelurahan} - ${selectedItem.postal_code}`
                                        : user.city_id
                                        ? `ID Kota: ${user.city_id} (data belum ditemukan)`
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
                                                    value={`${item.provinsi} ${item.kota} ${item.kecamatan} ${item.kelurahan} ${item.postal_code}`}
                                                    onSelect={() => {
                                                        setSelectedId(item.id);
                                                        setData(
                                                            "city_id",
                                                            item.id.toString()
                                                        );
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedId ===
                                                                item.id
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
                        <Label htmlFor="address">Alamat</Label>
                        <Textarea
                            onChange={(e) => setData("address", e.target.value)}
                            value={data.address}
                            placeholder="Alamat Lengkap"
                        />
                    </div>
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="address">Lokasi Warehouse/Gudang</Label>
                        <Select
                            onValueChange={(value) =>
                                setData("warehouse_id", value)
                            }
                            value={data.warehouse_id}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Lokasi Gudang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        Pilih Lokasi Gudang
                                    </SelectLabel>
                                    {warehouse.map((item) => (
                                        <SelectItem
                                            value={item.id.toString()}
                                            key={item.id}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="vehicle_number">Nomor Kendaraan </Label>
                        <Input
                            type="text"
                            id="vehicle_number"
                            name="vehicle_number"
                            onChange={(e) =>
                                setData("vehicle_number", e.target.value)
                            }
                            value={data.vehicle_number}
                            placeholder="Nomor Kendaraan"
                        />
                    </div>
                </div>
                <div className="col-span-1 p-6 bg-white max-h-min rounded-2xl">
                    <div className="grid items-center w-full gap-3">
                        <Label htmlFor="image">Avatar</Label>
                        {imagePreview && (
                            <div className="flex justify-center mt-3 mb-5">
                                <img
                                    src={imagePreview}
                                    alt="Image Preview"
                                    className="object-cover w-32 h-32 rounded-full" // Customize the size and styling as needed
                                />
                            </div>
                        )}
                        <div className="flex justify-center">
                            <Input
                                type="file"
                                id="image"
                                accept="image/*"
                                name="image"
                                onChange={handleFileChange} // Handle file change event
                            />
                        </div>
                        {progress && (
                            <div className="w-full">
                                <Progress
                                    value={progress.percentage}
                                    className="h-4 bg-gray-200 [&>div]:bg-green-500"
                                />

                                <div className="text-center mt-2 text-sm font-medium">
                                    {progress.percentage}%
                                </div>
                            </div>
                        )}
                        {processing ? (
                            <Button
                                disabled
                                className="mt-10 rounded-full bg-biru"
                            >
                                <Loader2 className="animate-spin" />
                                Tunggu Sebentar...
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="mt-10 rounded-full bg-biru"
                            >
                                Update Profile
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
