import { format } from "date-fns";
import prismadb  from "@/lib/prismadb";

interface BillboardColumn {
    id: string;
    label: string;
    createdAt: string;
}

export const getBillboards = async (storeId: string): Promise<BillboardColumn[]> => {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId,
        },
    });

    const formattedBillboards: BillboardColumn[] = billboards.map((item: { id: string; label: string; createdAt: Date }) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return formattedBillboards;
};
