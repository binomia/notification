import {NOTIFICATION_SERVER_PORT, PROMETHEUS_PORT, ZERO_ENCRYPTION_KEY} from "@/constants";
import { globalTriggers } from "@/triggers";
import { Extensions, Server, LANGUAGES } from "cromio";

export const server = new Server({
    port: Number(NOTIFICATION_SERVER_PORT),
    clients: [
        {
            ip: "*",
            language: LANGUAGES.NODEJS,
            secretKey: ZERO_ENCRYPTION_KEY
        }
    ]
})

export const httpServer = server.getHttpServerInstance();

server.addExtension(Extensions.serverPrometheusMetrics({
    port: Number(PROMETHEUS_PORT),
}));

server.registerTriggerDefinition(globalTriggers);
