import redis from "../lib/redis.js";

const LOCK_TTL = 30; // seconds
const RESPONSE_TTL = 60 * 60 * 24; // 24 hours

export const idempotencyMiddleware = async (req, res, next) => {
  try {
    const key = req.header("Idempotency-Key");

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Idempotency-Key header is required",
      });
    }

    const responseKey = `idempotency:response:${key}`;
    const lockKey = `idempotency:lock:${key}`;

    // 1. Return cached response if already processed
    const cached = await redis.get(responseKey);

    if (cached) {
      const parsed = JSON.parse(cached);

      return res.status(parsed.statusCode).json(parsed.body);
    }

    // 2. Acquire distributed lock
    const acquired = await redis.set(
      lockKey,
      "processing",
      "NX",
      "EX",
      LOCK_TTL
    );

    if (!acquired) {
      return res.status(409).json({
        success: false,
        message: "Request already in progress",
      });
    }

    req.idempotency = {
      responseKey,
      lockKey,
      responseTTL: RESPONSE_TTL,
    };

    next();
  } catch (err) {
    next(err);
  }
};