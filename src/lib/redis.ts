import { Redis } from "@upstash/redis";

type RedisClient = Pick<
  Redis,
  | "get"
  | "set"
  | "del"
  | "incr"
  | "hgetall"
  | "hset"
  | "lrange"
  | "lpush"
  | "zadd"
  | "zcard"
  | "zrange"
  | "zremrangebyrank"
>;

const createRedisClient = (): RedisClient | null => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
};
    
const redisClient = createRedisClient();

const mockRedis: RedisClient = {
  get: async <TData>() => null as TData | null,
  set: async <TData>() => "OK" as "OK" | TData | null,
  del: async () => 0,
  incr: async () => 0,
  hgetall: async <TData extends Record<string, unknown>>() => null as TData | null,
  hset: async () => 0,
  lrange: async <TData extends unknown[]>() => [] as unknown as TData,
  lpush: async () => 0,
  zadd: async () => 0,
  zcard: async () => 0,
  zrange: async <TData extends unknown[]>() => [] as unknown as TData,
  zremrangebyrank: async () => 0,
};

export const redis: RedisClient = redisClient || mockRedis;

