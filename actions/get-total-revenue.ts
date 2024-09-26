import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
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

    // Adaugă tipurile explicite pentru 'total', 'order' și 'item'
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const totalRevenue = paidOrders.reduce((total: number, order: { orderItems: { product: { price: any } }[] }) => {
        const orderTotal = order.orderItems.reduce((orderSum: number, item: { product: { price: { toNumber: () => number } } }) => {
            return orderSum + item.product.price.toNumber();
        }, 0);
        return total + orderTotal;
    }, 0);

    return totalRevenue;
};
