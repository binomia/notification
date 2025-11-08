import {environmentVariables} from '@/constants';
import {Expo, ExpoPushMessage} from 'expo-server-sdk';
import {z} from "zod";
import {ZodSchemas} from "@/schemas";

const expo = new Expo({
    accessToken: environmentVariables.EXPO_ACCESS_TOKEN,
    useFcmV1: true,
});

export const sendNotification = async (tokens: z.infer<typeof ZodSchemas.pushNotification>) => {
    try {
        const messages: ExpoPushMessage[] = tokens.map(({token, message}) => {
            return {
                to: token,
                sound: 'money.wav',
                body: message,
                data: {
                    withSome: 'data',
                }
            }
        });

        await expo.sendPushNotificationsAsync(messages);

    } catch (error) {
        console.log({sendNotification: error});
    }
}