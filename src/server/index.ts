import { NOTIFICATION_SERVER_PORT, PROMETHEUS_PORT } from "@/constants";
import { globalTriggers } from "@/triggers";
import { Extensions, Server } from "cromio";


export const server = new Server({
    port: Number(NOTIFICATION_SERVER_PORT)
})


export const httpServer = server.getHttpServerInstance();


server.addExtension(Extensions.serverPrometheusMetrics({
    port: Number(PROMETHEUS_PORT)
}));

server.registerTriggerDefinition(globalTriggers);
