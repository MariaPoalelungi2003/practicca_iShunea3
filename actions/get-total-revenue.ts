// Place this at the top of your file
import prismadb from "@/lib/prismadb";
import { Decimal } from "@prisma/client"; // Assuming Decimal is imported from Prisma

// Define the extended type for an order that includes orderItems and their products
type OrderWithItems = {
    id: string;
    storeId: string;
    isPaid: boolean;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    orderItems: {
        product: {
            price: Decimal; // Or number if you want to convert it to a number
        };
    }[];
};

export const getTotalRevenue = async (storeId: string): Promise<number> => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    return paidOrders.reduce((total: number, order: OrderWithItems) => {
        const orderTotal = order.orderItems.reduce((orderSum: number, item) => {
            return orderSum + item.product.price.toNumber();
        }, 0);
        return total + orderTotal;
    }, 0);
};
