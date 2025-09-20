import { Server } from "socket.io";
import { Job, JobJson, Queue, Worker } from "bullmq";


export const initSocket = async (io: Server) => {
    io.on("connection", (socket) => {
        const clientId = socket.handshake.query.username

        if (clientId) {
            socket.join(clientId);
            console.log("a user connected:", socket.handshake.query.username);
        }

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
}
