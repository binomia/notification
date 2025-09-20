import Controller from "@/controllers";
import { redisConnection } from "@/redis";
import { Job, Worker } from "bullmq";
import { Server } from "socket.io";


export class Queues {
    static notifications = (io: Server) => {
        const worker = new Worker('notifications', async (job: Job) => Controller.executeJob(job.asJSON(), io), {
            connection: redisConnection,
            settings: {
                backoffStrategy: (attemptsMade: number) => attemptsMade * 1000
            }
        })

        worker.on('completed', (job: Job) => {
            console.log('Job completed', job.asJSON().id);
            job.remove();
        })

        worker.on("failed", (job: Job | undefined) => {
            if (job) {
                console.log('Job failed', job.failedReason);
            }
        })
    }
}

