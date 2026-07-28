import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export const executeGetOrder = async (orderId) => {

    const order = await prisma.payment.findUnique({
        where: {
            orderId,
        },
    });

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    return {
        success: true,
        order,
    };
};