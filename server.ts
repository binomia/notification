import "dotenv/config"
import {Server as SocketIOServer} from 'socket.io';
import {NOTIFICATION_SOCKET_IO_PORT, NOTIFICATION_TRIGGERS} from "@/constants";
import {initSocket} from "@/sockets";
import {server} from "@/server";
import {ServerTypes} from "cromio";
import {ZodSchemas} from "@/schemas";
import {sendNotification} from "@/expo";

server.start(async (url: string) => {
    const io = new SocketIOServer(NOTIFICATION_SOCKET_IO_PORT, {
        cors: {
            origin: "*"
        }
    });

    await initSocket(io);
    console.log("Client connected");

    server.onTrigger(NOTIFICATION_TRIGGERS.SOCKET_EVENT_EMITTER, async ({body}: ServerTypes.OnTriggerType) => {
        try {
            const {data, channel, senderSocketRoom, recipientSocketRoom} = body;
            io.to([recipientSocketRoom, senderSocketRoom]).emit(channel, data)
            return true

        } catch (error) {
            console.log({socketEventEmitter: error});
            return false;
        }
    });

    server.onTrigger(NOTIFICATION_TRIGGERS.PUSH_EXPO_NOTIFICATION, async ({body}: ServerTypes.OnTriggerType) => {

        try {
            const data = await ZodSchemas.pushNotification.parseAsync(body);
            await sendNotification(data)
            return true

        } catch (error) {
            console.log({pushExpoNotification: error});
            return false;
        }
    });

    console.log(`[Notification]: worker ${process.pid} is running on ${url}`);
})