import {
    executeCreateOrder,
} from "../commands/payment/createOrder.command.js";

import {
    executePayOrder,
} from "../commands/payment/payOrder.command.js";

import {
    executeVerifyPayment,
} from "../commands/payment/verifyPayment.command.js";

import {
    executeGetPayment,
} from "../queries/payment/getPayment.query.js";

import {
    executeGetOrder,
} from "../queries/payment/getOrder.query.js";

import AppError from "../utils/AppError.js";

export const createOrder = async (req, res, next) => {
    try {
        const result = await executeCreateOrder(req.user.id, req.body);

        res.status(201).json(result);
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(error);
    }
};

export const payOrder = async (req, res, next) => {
    try {
        const result = await executePayOrder(req.user.id, req.body);

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(error);
    }
};

export const verifyPayment = async (req, res, next) => {
    try {
        const result = await executeVerifyPayment(req.user.id, req.body);

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(error);
    }
};

export const getPayment = async (req, res, next) => {
    try {
        const result = await executeGetPayment(req.params.paymentId);

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(error);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const result = await executeGetOrder(req.params.orderId);

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof AppError) return next(error);
        next(error);
    }
};