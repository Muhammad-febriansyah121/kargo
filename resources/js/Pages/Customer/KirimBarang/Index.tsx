import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { CityType } from "@/types/city";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronsUpDown,
    Loader2,
    SendHorizonal,
} from "lucide-react";
import { FormEventHandler, useState } from "react";
import { Step, Stepper } from "react-form-stepper";
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
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BiPaperPlane } from "react-icons/bi";
import { ServiceRateType } from "@/types/service_rate";
import { useForm } from "@inertiajs/react";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import axios from "axios";
import { toast } from "sonner";
import { ShippingServiceType } from "@/types/shipping_service";

interface Props {
    setting: SettingType;
    auth: UserType;
    city: CityType[];
    service: ShippingServiceType[];
}
export default function Index({ setting, auth, city, service }: Props) {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [data, setData] = useState({
        nama_barang: "",
        berat: "",
        panjang: "",
        tinggi: "",
        lebar: "",
        shipping_service_id: "",
        origin_city_id: "",
        destination_city_id: "",
        recipient_name: "",
        recipient_phone: "",
        recipient_address: "",
        payment_method: "",
        pickup_type: "",
        pickup_address: "",
        notes: "",
    });

    const selectedItem = city.find((item) => item.id === selectedId);
    const handlePickupTypeChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            pickup_type: value,
            pickup_address: value === "pickup" ? prev.pickup_address : "", // reset alamat kalau bukan pickup
        }));
    };
    // Mengubah data input pada state
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    // Fungsi untuk mengirim data pengiriman barang
    const sendBarang = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true); // Set proses sedang berjalan

        try {
            const response = await axios.post(
                route("customers.sendbarang"),
                data
            );

            // Jika ada redirect_url, maka lakukan redirect ke Midtrans
            const { redirect_url } = response.data;
            if (redirect_url) {
                window.location.href = redirect_url; // Redirect ke Midtrans jika ada
            } else {
                setOpen(true); // Menampilkan modal atau konfirmasi sukses
                setData({
                    nama_barang: "",
                    berat: "",
                    panjang: "",
                    tinggi: "",
                    lebar: "",
                    shipping_service_id: "",
                    origin_city_id: "",
                    destination_city_id: "",
                    recipient_name: "",
                    recipient_phone: "",
                    recipient_address: "",
                    payment_method: "",
                    pickup_type: "",
                    pickup_address: "",
                    notes: "",
                }); // Reset form setelah berhasil
            }
        } catch (error: any) {
            // Jika terjadi error, tampilkan notifikasi error menggunakan Sonner
            toast.error(
                error.response?.data.message ||
                    "Terjadi kesalahan, silakan coba lagi."
            );
            setErrors(error.response?.data.errors || {}); // Tangani error dari response jika ada
            console.log(error);
        } finally {
            setProcessing(false); // Selesai memproses
        }
    };

    return (
        <CustomerLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-2xl">
                            Form Kirim Barang
                        </h3>
                        <p className="text-sm text-gray-500">
                            Harap isi form dibawah ini dengan sebenar-benarnya.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl">
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={sendBarang}
                        >
                            <div className="space-y-5">
                                <h3 className="font-bold text-xl">
                                    Detail Barang
                                </h3>
                                <div className="grid w-full  items-center gap-2">
                                    <Label htmlFor="name_item">
                                        Nama Barang
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name_item"
                                        name="nama_barang"
                                        onChange={handleInputChange}
                                        value={data.nama_barang}
                                        placeholder="Nama Barang Yang Dikirim"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="name">
                                            Berat (kg)
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.5"
                                            onChange={handleInputChange}
                                            name="berat"
                                            value={data.berat}
                                        />
                                    </div>
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="phone_recipient">
                                            Panjang (cm)
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="30"
                                            name="panjang"
                                            onChange={handleInputChange}
                                            value={data.panjang}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="name">
                                            Tinggi (cm)
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            step="0.01"
                                            placeholder="10"
                                            name="tinggi"
                                            onChange={handleInputChange}
                                            value={data.tinggi}
                                        />
                                    </div>
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="phone_recipient">
                                            Lebar (cm)
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="20"
                                            name="lebar"
                                            onChange={handleInputChange}
                                            value={data.lebar}
                                        />
                                    </div>
                                </div>

                                <div className="grid w-full  items-center gap-2">
                                    <Label htmlFor="address_recipient">
                                        Layanan Pengiriman
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.shipping_service_id}
                                        onValueChange={(value) => {
                                            console.log(
                                                "Shipping Rate ID selected:",
                                                value
                                            ); // Tambahkan log
                                            setData((prevData) => ({
                                                ...prevData,
                                                shipping_service_id: value,
                                            }));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Layanan Pengiriman" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {service.map((item) => (
                                                <SelectItem
                                                    value={item.id.toString()}
                                                    key={item.id}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-5">
                                <h3 className="font-bold text-xl">
                                    Informasi Pengirim
                                </h3>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="name">
                                            Nama Lengkap
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={auth.name}
                                            readOnly
                                            placeholder="Nama Lengkap"
                                        />
                                    </div>
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="name">
                                            Email
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={auth.email}
                                            readOnly
                                            placeholder="Nama Lengkap"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="name">
                                            Nomor Telepon
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={auth.phone?.toString()}
                                            readOnly
                                            placeholder="Nama Lengkap"
                                        />
                                    </div>
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="name">
                                            Jenis Kelamin
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={auth.gender?.toString()}
                                            readOnly
                                            placeholder="Nama Lengkap"
                                        />
                                    </div>
                                </div>
                                <div className="grid w-full  items-center gap-2">
                                    <Label htmlFor="asal">
                                        Kota Asal
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        value={auth.city?.kota}
                                        readOnly
                                        placeholder="Nama Lengkap"
                                    />
                                </div>
                                <div className="grid w-full  items-center gap-2">
                                    <Label htmlFor="name">
                                        Alamat
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        value={auth.address?.toString()}
                                        readOnly
                                        placeholder="Nama Lengkap"
                                    />
                                </div>
                            </div>
                            <div className="space-y-5">
                                <h3 className="font-bold text-xl">
                                    Informasi Penerima
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <div className="grid w-full  items-center gap-2">
                                            <Label htmlFor="name">
                                                Nama Lengkap
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                type="text"
                                                id="name"
                                                value={data.recipient_name}
                                                name="recipient_name"
                                                onChange={handleInputChange}
                                                placeholder="Nama Lengkap"
                                            />
                                        </div>
                                        <div className="grid w-full  items-center gap-2">
                                            <Label htmlFor="phone_recipient">
                                                Nomor Telepon
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                id="phone_recipient"
                                                placeholder="Nomor Telepon"
                                                value={data.recipient_phone}
                                                name="recipient_phone"
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="store">
                                            Kota Tujuan
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Popover
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-between text-sm"
                                                >
                                                    {selectedItem
                                                        ? `${selectedItem.kota}`
                                                        : " Kota Tujuan"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="md:w-[500px] w-[300px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Cari kota, kecamatan, dll..." />
                                                    <CommandEmpty>
                                                        Tidak ditemukan
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        <CommandList>
                                                            {city.map(
                                                                (item) => (
                                                                    <CommandItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={item.id.toString()}
                                                                        onSelect={(
                                                                            value
                                                                        ) => {
                                                                            const id =
                                                                                parseInt(
                                                                                    value
                                                                                );
                                                                            setSelectedId(
                                                                                id
                                                                            );

                                                                            setData(
                                                                                (
                                                                                    prevData
                                                                                ) => ({
                                                                                    ...prevData,
                                                                                    destination_city_id:
                                                                                        id.toString(), // karena data awal kamu semua string
                                                                                })
                                                                            );

                                                                            setOpen(
                                                                                false
                                                                            );
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
                                                                            {
                                                                                item.provinsi
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                item.kota
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                item.kecamatan
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                item.kelurahan
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                item.postal_code
                                                                            }
                                                                        </span>
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandList>
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="grid w-full  items-center gap-2">
                                        <Label htmlFor="address_recipient">
                                            Alamat Penerima
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Textarea
                                            id="address_recipient"
                                            placeholder="Alamat Lengkap Penerima"
                                            value={data.recipient_address}
                                            onChange={handleInputChange}
                                            name="recipient_address"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-5">
                                <h3 className="font-bold text-xl">
                                    Pembayaran
                                </h3>
                                <div className="grid w-full gap-6">
                                    <div className="grid w-full items-center space-y-3">
                                        <Label htmlFor="pickup_type">
                                            Metode Pengiriman{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <RadioGroup
                                            id="pickup_type"
                                            value={data.pickup_type}
                                            onValueChange={
                                                handlePickupTypeChange
                                            }
                                            className="flex flex-col md:flex-row gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="pickup"
                                                    id="pickup"
                                                />
                                                <Label htmlFor="pickup">
                                                    Pick Up
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="dropoff"
                                                    id="dropoff"
                                                />
                                                <Label htmlFor="dropoff">
                                                    Diantar
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                {data.pickup_type === "pickup" && (
                                    <div className="grid w-full items-center gap-2">
                                        <Label htmlFor="pickup_address">
                                            Alamat Pick Up{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Textarea
                                            id="pickup_address"
                                            placeholder="Alamat Lengkap Pick Up"
                                            value={data.pickup_address}
                                            onChange={(e) =>
                                                setData((prev) => ({
                                                    ...prev,
                                                    pickup_address:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                )}

                                <div className="grid w-full items-center space-y-3">
                                    <Label htmlFor="pickup_type">
                                        Metode Pembayaran{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            console.log(
                                                "Selected payment method:",
                                                value
                                            ); // Cek nilai yang dipilih
                                            setPaymentMethod(value);
                                            setData((prevData) => ({
                                                ...prevData,
                                                payment_method: value, // Update payment_method di data state
                                            }));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Metode Pembayaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">
                                                Cash
                                            </SelectItem>
                                            <SelectItem value="transfer">
                                                Transfer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="pickup_address">
                                        Catatan{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="pickup_address"
                                        placeholder="Catatan"
                                        value={data.notes}
                                        name="notes"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center max-w-[12rem] space-x-2">
                                {processing ? (
                                    <Button
                                        disabled
                                        className="w-full rounded-full bg-biru"
                                    >
                                        <Loader2 className="animate-spin" />
                                        Tunggu Sebentar...
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="flex items-center bg-biru gap-3 w-full"
                                    >
                                        <SendHorizonal size={20} /> Kirim
                                        Sekarang
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </CustomerLayout>
    );
}
