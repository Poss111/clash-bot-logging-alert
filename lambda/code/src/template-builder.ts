import {
    DiscordWebhookEmbedFieldPayload,
    DiscordWebhookEmbedPayload,
    DiscordWebhookPayload
} from "./interface/DiscordWebhookPayload";

export function buildPayload(id: number, method: string, path: string, params: string, msg: string): DiscordWebhookPayload {
    const idField: DiscordWebhookEmbedFieldPayload = {name: "ID", value: `${id}`};
    const methodField: DiscordWebhookEmbedFieldPayload = {name: "Request Type", value: method};
    const pathField: DiscordWebhookEmbedFieldPayload = {name: "Request Path", value: path};
    const paramsField: DiscordWebhookEmbedFieldPayload = {name: "Parameters", value: params};
    const msgField: DiscordWebhookEmbedFieldPayload = {name: "Message", value: msg};
    const embed: DiscordWebhookEmbedPayload = {
        title: "Clash Bot - Error Log",
        color: 16580608,
        fields: [idField, methodField, pathField, paramsField, msgField]
    };
    return {attachments: [], content: undefined, embeds: [embed]};
}