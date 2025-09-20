import { ZERO_ENCRYPTION_KEY } from "@/constants";
import { JobJson } from "bullmq";
import { AES } from "cryptografia";
import { Server } from "socket.io";



export default class Controller {
    static executeJob = async ({ data }: JobJson, io: Server): Promise<void> => {
        try {            
            const decryptedData = await AES.decryptAsync(JSON.parse(data), ZERO_ENCRYPTION_KEY);            
            const { transaction, channel, senderSocketRoom, recipientSocketRoom } = JSON.parse(decryptedData);
            
            io.to([recipientSocketRoom, senderSocketRoom]).emit(channel, transaction)

        } catch (error) {
            console.log({ prosessTransaction: error });
            throw error
        }
    }
} 