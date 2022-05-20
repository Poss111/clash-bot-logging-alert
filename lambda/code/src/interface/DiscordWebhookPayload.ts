export interface DiscordWebhookPayload {
    content: any,
    embeds: DiscordWebhookEmbedPayload[],
    attachments: any[]
}

export interface DiscordWebhookEmbedPayload {
    title: string,
    color: number,
    fields: DiscordWebhookEmbedFieldPayload[]
}

export interface DiscordWebhookEmbedFieldPayload {
    name: string,
    value: string
}