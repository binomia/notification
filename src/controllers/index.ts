import { ZERO_ENCRYPTION_KEY } from "@/constants";
import Email from "@/email";
import { sendNotification } from "@/expo";
import { JobJson } from "bullmq";
import { AES, HASH } from "cryptografia";
import { Server } from "socket.io";
import jwt from 'jsonwebtoken';


export default class Controller {
    static executeJob = async ({ data, name }: JobJson, io: Server): Promise<void> => {
        try {
            const decryptedData = await AES.decryptAsync(JSON.parse(data), ZERO_ENCRYPTION_KEY);

            switch (true) {
                case name.includes("newTransactionNotification"): {
                    await sendNotification(JSON.parse(decryptedData))
                    break;
                }
                case name.includes("transactionNotification"): {
                    const { transaction, channel, senderSocketRoom, recipientSocketRoom } = JSON.parse(decryptedData);
                    io.to([recipientSocketRoom, senderSocketRoom]).emit(channel, transaction)
                    break;
                }
                case name.includes("sendVerificationCode"): {
                    const { email, code } = JSON.parse(decryptedData);
                    await Email.sendVerificationCode(email, code);
                    break;
                }
                case name.includes("sendEmail"): {
                    const { to, subject, text, html } = JSON.parse(decryptedData);
                    await Email.send({ to, subject, text, html })
                    break;
                }
                default:
                    break;
            }


        } catch (error) {
            console.log({ prosessTransaction: error });
            throw error
        }
    }
} 