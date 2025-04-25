import { CityType } from "@/types/city";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingType } from "@/types/setting";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
    setting: SettingType;
}
export default function FormLogin({ setting }: Props) {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        "g-recaptcha-response": "",
    });
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data["g-recaptcha-response"]) {
            toast.error("Harap selesaikan reCAPTCHA.", {
                position: "top-right",
                richColors: true,
            });
            return;
        }

        post(route("home.checklogin"), {
            onError: () => {
                toast.error("Email atau password yang anda masukkan salah.", {
                    position: "top-right",
                    richColors: true,
                });
            },
        });
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
                className="lg:px-20 lg:max-w-xl justify-center lg:py-10 flex flex-col gap-5"
            >
                <h3 className="font-bold text-xl md:text-3xl">
                    Gabung {setting.site_name}
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                    Isi data kamu untuk bergabung di{" "}
                    <strong>{setting.site_name}</strong>
                </p>

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
                            Login
                        </PulsatingButton>
                    )}
                </div>
                <span className="text-sm text-center block md:flex items-center justify-center">
                    Belum punya akun?
                    <Link
                        href="/home/register"
                        className="font-bold text-biru ml-1.5"
                    >
                        Daftar Sekarang
                    </Link>
                </span>
            </form>
        </div>
    );
}
