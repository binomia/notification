import { Server } from "socket.io";

export const initSocket = async (io: Server) => {
    io.on("connection", (socket) => {
        const clientId = socket.handshake.query.username
        console.log("Client ID: ", clientId);

        if (clientId) {
            socket.join(clientId);
            console.log("a user connected:", socket.handshake.query.username);
        }

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
}
