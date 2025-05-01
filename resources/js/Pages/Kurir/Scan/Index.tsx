import KurirLayout from "@/Layouts/Kurir/KurirLayout";
import { SettingType } from "@/types/setting";
import { UserType } from "@/types/user";

interface Props {
    setting: SettingType;
    auth: UserType;
}
export default function Index({ setting, auth }: Props) {
    return (
        <KurirLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10"></div>
            </section>
        </KurirLayout>
    );
}
