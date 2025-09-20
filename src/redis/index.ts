import Redis from "ioredis";


export const redisConnection = {
    host: "redis",
    port: 6379
}


export const redis = new Redis(redisConnection)
export const subscriber = new Redis(redisConnection)


