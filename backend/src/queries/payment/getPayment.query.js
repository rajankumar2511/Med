import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export const executeGetPayment = async (paymentId) => {

    const payment = await prisma.payment.findUnique({
        where: {
            paymentId,
        },
    });

    if (!payment) {
        throw new AppError("Payment not found", 404);
    }

    return {
        success: true,
        payment,
    };
};