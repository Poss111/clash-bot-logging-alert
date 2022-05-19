import {APIGatewayEventRequestContext, APIGatewayProxyResult, SNSEvent} from "aws-lambda";

export function handler(event: SNSEvent, context?: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> {
    console.log(JSON.stringify(event));
    return new Promise<APIGatewayProxyResult>((resolve) => {
        resolve({
            statusCode: 200,
            body: `Successfully posted logs`
        })
    });
}

