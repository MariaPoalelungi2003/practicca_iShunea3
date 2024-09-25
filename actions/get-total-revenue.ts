import prismadb from "@/lib/prismadb";
import { Order, OrderItem } from "@prisma/client"; // Assuming you have these types from Prisma

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

    return paidOrders.reduce((total: number, order: Order) => {
        const orderTotal = order.orderItems.reduce((orderSum: number, item: OrderItem) => {
            return orderSum + item.product.price.toNumber();
        }, 0);
        return total + orderTotal;
    }, 0);
};
