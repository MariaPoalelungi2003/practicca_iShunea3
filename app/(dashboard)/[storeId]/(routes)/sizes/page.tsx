import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";

const SizesPage = async ({
                             params,
                         }: {
    params: { storeId: string };
}) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // Adăugarea tipului explicit pentru 'item'
    const formattedSizes: SizeColumn[] = sizes.map(
        (item: {
            id: string;
            name: string;
            value: string; // sau tipul adecvat dacă value este de un alt tip
            createdAt: Date;
        }) => ({
            id: item.id,
            name: item.name,
            value: item.value,
            createdAt: format(item.createdAt, "MMMM do, yyyy"),
        })
    );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={formattedSizes} />
            </div>
        </div>
    );
};

export default SizesPage;
