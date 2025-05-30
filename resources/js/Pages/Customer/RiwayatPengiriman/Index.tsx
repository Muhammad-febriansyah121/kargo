import CustomerLayout from "@/Layouts/Customer/CustomerLayout";
import { TransactionType } from "@/types/transaction";
import { UserType } from "@/types/user";
import TableRiwayat from "./components/table_riwayat";

interface Props {
    auth: UserType;
    trx: TransactionType[];
}
export default function Index({ auth, trx }: Props) {
    return (
        <CustomerLayout auth={auth}>
            <section className="lg:pl-[250px]">
                <div className="px-7 pt-10 space-y-5">
                    <div className="bg-white rounded-2xl p-5">
                        <TableRiwayat trx={trx} />
                    </div>
                </div>
            </section>
        </CustomerLayout>
    );
}
