import {DiscordWebhookPayload} from "../interface/DiscordWebhookPayload";
import {buildGenericErrorPayload, buildRequestErrorPayload} from "../template-builder";

describe('Template Builder', () => {

    describe('Request Error Handler', () => {
        test('(Successful) - When template builder is given with the log details it should be built successfully.', () => {
            const builtPayload: DiscordWebhookPayload = buildRequestErrorPayload(1, "GET", "/dne", "something=2", "Failed to find path.");
            expect(builtPayload).toBeTruthy();
            expect(builtPayload.embeds).toHaveLength(1);
            expect(builtPayload.embeds[0].title).toEqual("Clash Bot - Request Error Log");
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

    describe('Generic Error Handler', () => {
        test('(Successful) - When template builder is given with the log details from a generic error message it should be built successfully.', () => {
            const builtPayload: DiscordWebhookPayload = buildGenericErrorPayload("TeamsService", "getTeams", "Failed to parse.", undefined);
            expect(builtPayload).toBeTruthy();
            expect(builtPayload.embeds).toHaveLength(1);
            expect(builtPayload.embeds[0].title).toEqual("Clash Bot - Generic Error Log");
            expect(builtPayload.embeds[0].color).toEqual(16580608);
            expect(builtPayload.embeds[0].fields).toHaveLength(3);
            expect(builtPayload.embeds[0].fields[0].name).toEqual("Class");
            expect(builtPayload.embeds[0].fields[0].value).toEqual("TeamsService");
            expect(builtPayload.embeds[0].fields[1].name).toEqual("Method");
            expect(builtPayload.embeds[0].fields[1].value).toEqual("getTeams");
            expect(builtPayload.embeds[0].fields[2].name).toEqual("Message");
            expect(builtPayload.embeds[0].fields[2].value).toEqual("Failed to parse.");
            expect(builtPayload.attachments).toHaveLength(0);
            expect(builtPayload.content).toBeFalsy();
        })

        test('(Successful) - When template builder is given with the log details from a generic error message with a stack it should be built successfully.', () => {
            const builtPayload: DiscordWebhookPayload = buildGenericErrorPayload("TeamsService", "getTeams", "Failed to parse.", { message: 'Failed to parse', stack: 'Stacky'});
            expect(builtPayload).toBeTruthy();
            expect(builtPayload.embeds).toHaveLength(1);
            expect(builtPayload.embeds[0].title).toEqual("Clash Bot - Generic Error Log");
            expect(builtPayload.embeds[0].color).toEqual(16580608);
            expect(builtPayload.embeds[0].fields).toHaveLength(5);
            expect(builtPayload.embeds[0].fields[0].name).toEqual("Class");
            expect(builtPayload.embeds[0].fields[0].value).toEqual("TeamsService");
            expect(builtPayload.embeds[0].fields[1].name).toEqual("Method");
            expect(builtPayload.embeds[0].fields[1].value).toEqual("getTeams");
            expect(builtPayload.embeds[0].fields[2].name).toEqual("Error Message");
            expect(builtPayload.embeds[0].fields[2].value).toEqual("Failed to parse");
            expect(builtPayload.embeds[0].fields[3].name).toEqual("Stack");
            expect(builtPayload.embeds[0].fields[3].value).toEqual("Stacky");
            expect(builtPayload.embeds[0].fields[4].name).toEqual("Message");
            expect(builtPayload.embeds[0].fields[4].value).toEqual("Failed to parse.");
            expect(builtPayload.attachments).toHaveLength(0);
            expect(builtPayload.content).toBeFalsy();
        })
    })
})