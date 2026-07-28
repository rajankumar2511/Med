import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

export { redis };
export default redis;