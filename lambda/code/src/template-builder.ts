import {
    DiscordWebhookEmbedFieldPayload,
    DiscordWebhookEmbedPayload,
    DiscordWebhookPayload
} from "./interface/DiscordWebhookPayload";

export function buildRequestErrorPayload(id: number, method: string, path: string, params: string, msg: string): DiscordWebhookPayload {
    const idField: DiscordWebhookEmbedFieldPayload = {name: "ID", value: `${id}`};
    const methodField: DiscordWebhookEmbedFieldPayload = {name: "Request Type", value: method};
    const pathField: DiscordWebhookEmbedFieldPayload = {name: "Request Path", value: path};
    const paramsField: DiscordWebhookEmbedFieldPayload = {name: "Parameters", value: params};
    const msgField: DiscordWebhookEmbedFieldPayload = {name: "Message", value: msg};
    const embed: DiscordWebhookEmbedPayload = {
        title: "Clash Bot - Request Error Log",
        color: 16580608,
        fields: [idField, methodField, pathField, paramsField, msgField]
    };
    return {attachments: [], content: undefined, embeds: [embed]};
}

export function buildGenericErrorPayload(className: string, method: string, message: string, error: any): DiscordWebhookPayload {
    const baseEmbeds = [
        {name: "Class", value: className},
        {name: "Method", value: method}
    ];
    if (error) {
        baseEmbeds.push({name: "Error Message", value: error.message});
        baseEmbeds.push({name: "Stack", value: error.stack});
    }
    const embed: DiscordWebhookEmbedPayload = {
        title: "Clash Bot - Generic Error Log",
        color: 16580608,
        fields: [
            ...baseEmbeds,
            {name: "Message", value: message}
        ]
    };
    return {attachments: [], content: undefined, embeds: [embed]};
}