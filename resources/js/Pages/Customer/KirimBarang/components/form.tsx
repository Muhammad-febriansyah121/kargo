import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CityType } from "@/types/city";
import { ShippingServiceType } from "@/types/shipping_service";
import { UserType } from "@/types/user";
import axios from "axios";
import { Check, ChevronsUpDown, Loader2, SendHorizonal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
interface Props {
    city: CityType[];
    service: ShippingServiceType[];
    auth: UserType;
}
export default function FormKirimBarang({ city, service, auth }: Props) {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [biaya, setBiaya] = useState<number | null>(null);
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
        } finally {
            setProcessing(false); // Selesai memproses
        }
    };
    useEffect(() => {
        if (selectedId !== null) {
            setData((prev) => ({
                ...prev,
                destination_city_id: selectedId.toString(),
            }));
        }
    }, [selectedId]);
    useEffect(() => {
        const berat = Number(data.berat);
        const panjang = Number(data.panjang);
        const lebar = Number(data.lebar);
        const tinggi = Number(data.tinggi);

        if (
            berat > 0 &&
            panjang > 0 &&
            lebar > 0 &&
            tinggi > 0 &&
            data.shipping_service_id &&
            data.destination_city_id
        ) {
            axios
                .post("/cek-biaya", data)
                .then((res) => {
                    const biaya = parseFloat(res.data.cost);
                    if (!isNaN(biaya)) {
                        setBiaya(biaya);
                    } else {
                        setBiaya(null);
                    }
                })
                .catch((error) => {
                    setBiaya(null);
                });
        }
    }, [data]);

    return (
        <form className="flex flex-col gap-4" onSubmit={sendBarang}>
            <div className="space-y-5">
                <h3 className="font-bold text-xl">Detail Barang</h3>
                <div className="grid w-full  items-center gap-2">
                    <Label htmlFor="name_item">
                        Nama Barang
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        required
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
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.5"
                            required
                            onChange={handleInputChange}
                            name="berat"
                            value={data.berat}
                        />
                    </div>
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="phone_recipient">
                            Panjang (cm)
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="30"
                            name="panjang"
                            required
                            onChange={handleInputChange}
                            value={data.panjang}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="name">
                            Tinggi (cm)
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            step="0.01"
                            placeholder="10"
                            name="tinggi"
                            required
                            onChange={handleInputChange}
                            value={data.tinggi}
                        />
                    </div>
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="phone_recipient">
                            Lebar (cm)
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="20"
                            name="lebar"
                            onChange={handleInputChange}
                            value={data.lebar}
                            required
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
                <h3 className="font-bold text-xl">Informasi Pengirim</h3>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="name">
                            Nama Lengkap
                            <span className="text-red-500">*</span>
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
                            <span className="text-red-500">*</span>
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
                            <span className="text-red-500">*</span>
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
                            <span className="text-red-500">*</span>
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
                <h3 className="font-bold text-xl">Informasi Penerima</h3>
                <div className="space-y-5">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="grid w-full  items-center gap-2">
                            <Label htmlFor="name">
                                Nama Lengkap
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                value={data.recipient_name}
                                name="recipient_name"
                                onChange={handleInputChange}
                                placeholder="Nama Lengkap"
                                required
                            />
                        </div>
                        <div className="grid w-full  items-center gap-2">
                            <Label htmlFor="phone_recipient">
                                Nomor Telepon
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="number"
                                min={0}
                                id="phone_recipient"
                                placeholder="Nomor Telepon"
                                value={data.recipient_phone}
                                name="recipient_phone"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid w-full  items-center gap-2">
                        <Label htmlFor="store">
                            Kota Tujuan
                            <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
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
                                    <CommandEmpty>Tidak ditemukan</CommandEmpty>
                                    <CommandGroup>
                                        <CommandList>
                                            {city.map((item) => (
                                                <CommandItem
                                                    key={item.id}
                                                    onSelect={() => {
                                                        setSelectedId(item.id);

                                                        setData((prevData) => ({
                                                            ...prevData,
                                                            destination_city_id:
                                                                item.id.toString(),
                                                        }));

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
                        <Label htmlFor="address_recipient">
                            Alamat Penerima
                            <span className="text-red-500">*</span>
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
                <h3 className="font-bold text-xl">Pembayaran</h3>
                <div className="grid w-full gap-6">
                    <div className="grid w-full items-center space-y-3">
                        <Label htmlFor="pickup_type">
                            Metode Pengiriman{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup
                            id="pickup_type"
                            value={data.pickup_type}
                            onValueChange={handlePickupTypeChange}
                            className="flex flex-col md:flex-row gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pickup" id="pickup" />
                                <Label htmlFor="pickup">Pick Up</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dropoff" id="dropoff" />
                                <Label htmlFor="dropoff">Diantar</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {data.pickup_type === "pickup" && (
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="pickup_address">Alamat Pick Up </Label>
                        <Textarea
                            id="pickup_address"
                            placeholder="Alamat Lengkap Pick Up"
                            value={data.pickup_address}
                            onChange={(e) =>
                                setData((prev) => ({
                                    ...prev,
                                    pickup_address: e.target.value,
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
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="pickup_address">Catatan </Label>
                    <Textarea
                        id="pickup_address"
                        placeholder="Catatan"
                        value={data.notes}
                        name="notes"
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            {biaya && (
                <div className="bg-teal-500 p-5 rounded-2xl text-white justify-end items-end flex gap-3">
                    <h3 className="font-medium">Total Biaya Pengiriman : </h3>{" "}
                    <span className="font-bold">
                        {biaya.toLocaleString("id-ID")}
                    </span>
                </div>
            )}
            <div className="flex items-center max-w-[12rem] space-x-2">
                {processing ? (
                    <Button disabled className="w-full rounded-full bg-biru">
                        <Loader2 className="animate-spin" />
                        Tunggu Sebentar...
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        className="flex items-center bg-biru gap-3 w-full"
                    >
                        <SendHorizonal size={20} /> Kirim Sekarang
                    </Button>
                )}
            </div>
        </form>
    );
}
