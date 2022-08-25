import {APIGatewayEventRequestContext, APIGatewayProxyResult} from "aws-lambda";
import {CloudWatchLogsEvent} from "aws-lambda/trigger/cloudwatch-logs";
import * as zlib from "zlib";
import {buildGenericErrorPayload, buildRequestErrorPayload} from "./template-builder";
import axios from "axios";

export function buildAndSendDiscordPayload(loggingOutput: any) {
    let message = JSON.parse(loggingOutput.logEvents[0].message);
    console.log("Event Data:", JSON.stringify(JSON.parse(loggingOutput.logEvents[0].message), null, 2));
    let discordWebhookPayload = message.req ?
        buildRequestErrorPayload(message.req.id, message.req.method, message.req.url, JSON.stringify(message.req.params), message.msg)
        : buildGenericErrorPayload(message.class, message.method, message.msg, message.error);
    console.log("Payload:", JSON.stringify(discordWebhookPayload, null, 2));
    return discordWebhookPayload;
}

function failedToParseLogMessage(e: Error) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            attachments: [],
            content: undefined,
            embeds: [{
                color: 16580608,
                fields: [
                    {name: "Failed", value: "Unable to parse log. Check Lambda."},
                    {name: "Exception", value: JSON.stringify(e)}
                ],
                title: "Clash Bot - Error Log"
            }]
        })
    };
}

export function handler(event: CloudWatchLogsEvent, context?: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> {
    const payload = Buffer.from(event.awslogs.data, 'base64');
    return new Promise<APIGatewayProxyResult>((resolve, reject) => {
        zlib.gunzip(payload, function (e, result) {
            if (e) {
                reject(failedToParseLogMessage(e));
            } else {
                let payload = {};
                try {
                    payload = buildAndSendDiscordPayload(JSON.parse(result.toString()));
                } catch(err: any) {
                    payload = failedToParseLogMessage(err);
                }
                axios({
                    method: "POST",
                    url: process.env.DISCORD_WEBHOOK_URL,
                    data: payload,
                    timeout: 10000
                }).then((res) => {
                    console.log(res);
                    resolve({
                        statusCode: 200,
                        body: JSON.stringify(payload),
                    })
                }).catch(err => {
                    console.error(err);
                    reject({
                        statusCode: 500,
                        body: "Failed to post to Discord with err.",
                        error: err
                    })
                })
            }
        })
    });
}

