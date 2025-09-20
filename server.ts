import "dotenv/config"
import { Server as SocketIOServer } from 'socket.io';
import { initSocket } from "@/sockets";
import { server } from "@/server";
import { Queues } from "@/queues";


server.start(async (url: string) => {
    console.log(`\n[Notification]: worker ${process.pid} is running on ${url}`);
    const io = new SocketIOServer({
        cors: {
            origin: "*"
        }
    });

    initSocket(io);
    Queues.notifications(io);

    io.listen(server.getHttpServerInstance());
})