import "dotenv/config"
import { Server as SocketIOServer } from 'socket.io';
import { initSocket } from "@/sockets";
import { Queues } from "@/queues";
import { NOTIFICATION_SERVER_PORT, PROMETHEUS_PORT } from "@/constants";
import { Extensions, Server } from "cromio";


const server = new Server({
    port: Number(NOTIFICATION_SERVER_PORT)
})

server.addExtension(Extensions.serverPrometheusMetrics({
    port: Number(PROMETHEUS_PORT)
}));

server.start(async (url: string) => {
    console.log(`[Notification]: worker ${process.pid} is running on ${url}`);
    const io = new SocketIOServer({
        cors: {
            origin: "*"
        }
    });

    initSocket(io);
    Queues.notifications(io);

    io.listen(server.getHttpServerInstance());
})