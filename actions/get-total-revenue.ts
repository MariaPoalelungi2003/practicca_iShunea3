import prismadb from "@/lib/prismadb";
import { Prisma } from "@prisma/client";  // import Prisma types

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

    type OrderWithItems = Prisma.OrderGetPayload<{
        include: { orderItems: { include: { product: true } } };
    }>;

    return paidOrders.reduce((total: number, order: OrderWithItems) => {
        const orderTotal = order.orderItems.reduce((orderSum: number, item) => {
            return orderSum + item.product.price.toNumber();
        }, 0);
        return total + orderTotal;
    }, 0);
};
