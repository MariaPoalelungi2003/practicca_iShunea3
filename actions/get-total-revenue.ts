import prismadb from "@/lib/prismadb";
import { Order, OrderItem } from "@prisma/client"; // Asigură-te că calea este corectă

export const getTotalRevenue = async (storeId: string): Promise<number> => {
    const paidOrders: Order[] = await prismadb.order.findMany({
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

    const totalRevenue = paidOrders.reduce((total: number, order: Order) => {
        const orderTotal = order.orderItems.reduce((orderSum: number, item: OrderItem) => {
            return orderSum + item.product.price.toNumber();
        }, 0);
        return total + orderTotal;
    }, 0);

    return totalRevenue;
}
