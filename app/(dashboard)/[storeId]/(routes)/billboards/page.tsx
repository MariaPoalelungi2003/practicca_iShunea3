import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

// Definirea tipului pentru 'item'
const BillboardsPage = async ({
                                  params,
                              }: {
    params: { storeId: string };
}) => {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Adăugarea tipului explicit pentru 'item'
    const formattedBillboards: BillboardColumn[] = billboards.map((item: { id: string; label: string; createdAt: Date }) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    );
};

export default BillboardsPage;
