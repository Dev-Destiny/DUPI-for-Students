import { Redis } from "ioredis";

import { env } from "../config/env";

// BullMQ strictly requires `maxRetriesPerRequest: null` for its internal blocking structures.
export const connection = new Redis(env.REDIS_URL, {
	maxRetriesPerRequest: null,
	tls: env.REDIS_URL.startsWith("rediss://") 
		? { rejectUnauthorized: false } 
		: undefined
});

connection.on("error", (err) => {
	console.error("Redis connection error:", err);
});
