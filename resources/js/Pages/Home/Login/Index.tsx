import AuthLayout from "@/Layouts/Auth/AuthLayout";
import { SettingType } from "@/types/setting";

import { CityType } from "@/types/city";
import FormLogin from "./components/form";

interface Props {
    setting: SettingType;
}
export default function Index({ setting }: Props) {
    return (
        <AuthLayout>
            <section>
                <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
                    <FormLogin setting={setting} />
                    <div className="relative hidden lg:block h-screen w-full">
                        <img
                            src={`/storage/${setting.thumbnail_login}`}
                            alt=""
                            className="fixed right-0 top-0 h-full w-1/2 object-cover z-0"
                        />
                    </div>
                </div>
            </section>
        </AuthLayout>
    );
}
