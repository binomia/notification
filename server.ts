import "dotenv/config"
import { Server as SocketIOServer } from 'socket.io';
import { NOTIFICATION_SOCKET_IO_PORT } from "@/constants";
import { initSocket } from "@/sockets";
import { server } from "@/server";
import { ServerTypes } from "cromio";


server.start(async (url: string) => {
    console.log(`\n[Notification]: worker ${process.pid} is running on ${url}`);
    const io = new SocketIOServer({
        cors: {
            origin: "*"
        }
    });

    initSocket(io);
    server.onTrigger("socketEventEmitter", async ({ body }: ServerTypes.OnTriggerType) => {
        try {
            const { data, channel, senderSocketRoom, recipientSocketRoom } = body;
            io.to([recipientSocketRoom, senderSocketRoom]).emit(channel, data)
            return true

        } catch (error) {
            console.log(error);
        }
    });

    io.listen(NOTIFICATION_SOCKET_IO_PORT);
})