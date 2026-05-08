import { Redis } from "ioredis";

import { env } from "../config/env.js";

// BullMQ strictly requires `maxRetriesPerRequest: null` for its internal blocking structures.
export const connection = new Redis(env.REDIS_URL, {
	maxRetriesPerRequest: null,
	enableReadyCheck: false,
	lazyConnect: true,
	tls: env.REDIS_URL.startsWith("rediss://")
		? { rejectUnauthorized: false }
		: undefined,
	keepAlive: 1000, // 1 second keep-alive to prevent ECONNRESET on idle
});

connection.on("error", (err) => {
	console.error("Redis connection error:", err);
});
