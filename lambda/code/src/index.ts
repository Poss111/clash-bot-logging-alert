import {APIGatewayEventRequestContext, APIGatewayProxyResult} from "aws-lambda";
import {CloudWatchLogsEvent} from "aws-lambda/trigger/cloudwatch-logs";
import * as zlib from "zlib";
import {buildPayload} from "./template-builder";
import axios from "axios";

export function handler(event: CloudWatchLogsEvent, context?: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> {
    const payload = Buffer.from(event.awslogs.data, 'base64');
    let loggingOutput;
    return new Promise<APIGatewayProxyResult>((resolve, reject) => {
        zlib.gunzip(payload, function (e, result) {
            if (e) {
                reject({
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
                });
            } else {
                loggingOutput = JSON.parse(result.toString());
                let message = JSON.parse(loggingOutput.logEvents[0].message);
                console.log("Event Data:", JSON.stringify(JSON.parse(loggingOutput.logEvents[0].message), null, 2));
                let discordWebhookPayload = buildPayload(message.req.id, message.req.method, message.req.url, JSON.stringify(message.req.params), message.msg);
                console.log("Payload:", JSON.stringify(discordWebhookPayload, null, 2));
                axios({
                    method: "POST",
                    url: "https://discord.com/api/webhooks/977029451474956379/moChs3neOgvdvneybMsMHFuHfSuO8GeauB6D6QFpM5VUumKsGvppF9zdIdZHARF4AV7p",
                    data: discordWebhookPayload,
                    timeout: 10000
                }).then((res) => {
                    console.log(res);
                    resolve({
                        statusCode: 200,
                        body: JSON.stringify(discordWebhookPayload),
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

