import {DiscordWebhookPayload} from "../interface/DiscordWebhookPayload";
import {buildPayload} from "../template-builder";

describe('Template Builder', () => {
    test('(Successful) - When template builder is given with the log details it should be built successfully.', () => {
        const builtPayload: DiscordWebhookPayload = buildPayload(1, "GET", "/dne", "something=2", "Failed to find path.");
        expect(builtPayload).toBeTruthy();
        expect(builtPayload.embeds).toHaveLength(1);
        expect(builtPayload.embeds[0].title).toEqual("Clash Bot - Error Log");
        expect(builtPayload.embeds[0].color).toEqual(16580608);
        expect(builtPayload.embeds[0].fields).toHaveLength(5);
        expect(builtPayload.embeds[0].fields[0].name).toEqual("ID");
        expect(builtPayload.embeds[0].fields[0].value).toEqual("1");
        expect(builtPayload.embeds[0].fields[1].name).toEqual("Request Type");
        expect(builtPayload.embeds[0].fields[1].value).toEqual("GET");
        expect(builtPayload.embeds[0].fields[2].name).toEqual("Request Path");
        expect(builtPayload.embeds[0].fields[2].value).toEqual("/dne");
        expect(builtPayload.embeds[0].fields[3].name).toEqual("Parameters");
        expect(builtPayload.embeds[0].fields[3].value).toEqual("something=2");
        expect(builtPayload.embeds[0].fields[4].name).toEqual("Message");
        expect(builtPayload.embeds[0].fields[4].value).toEqual("Failed to find path.");
        expect(builtPayload.attachments).toHaveLength(0);
        expect(builtPayload.content).toBeFalsy();
    })
})