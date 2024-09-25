import prismadb from "@/lib/prismadb";
import { Order, OrderItem } from "@prisma/client"; // Importing the necessary types

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

    // Adding explicit type annotations
    return paidOrders.reduce((total: number, order: Order) => {
        const orderTotal = order.orderItems.reduce((orderSum: number, item: OrderItem) => {
            return orderSum + item.product.price.toNumber(); // Ensure item.product.price is a Decimal and converted to number
        }, 0);
        return total + orderTotal;
    }, 0);
};
