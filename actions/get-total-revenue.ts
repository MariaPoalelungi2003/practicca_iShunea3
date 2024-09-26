import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string): Promise<number> => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    return paidOrders.reduce((total: number, order: { orderItems: { product: { price: { toNumber: () => number } } }[] }) => {
        const orderTotal = order.orderItems.reduce((orderSum: number, item: { product: { price: { toNumber: () => number } } }) => {
            return orderSum + item.product.price.toNumber();
        }, 0);
        return total + orderTotal;
    }, 0);
};
