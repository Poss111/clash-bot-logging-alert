import {handler} from "../index";
import {CloudWatchLogsEvent} from "aws-lambda/trigger/cloudwatch-logs";
import {DiscordWebhookPayload} from "../interface/DiscordWebhookPayload";
import {buildPayload} from "../template-builder";
import axios from "axios";

jest.mock("axios");

describe('Lambda Handler', () => {

    beforeAll(() => {
        process.env.DISCORD_WEBHOOK_URL = 'http://localhost/discord/webhook/url'
    })

    test('It should return a promise.', () => {
        const expectedData: CloudWatchLogsEvent = {
            awslogs: {
                data: "H4sIAAAAAAAAAG1T21LkNhD9FZdfFjYj27J8HYqHyYawyUJlw5DKbbYoWW6PVdiSkTXDLBT/nrYMFcLGL5a6T58+6suj38M48i1cfx3AX/o/rK5XN5dn6/Xq/Mxf+PpegUFzQbMyZkWcJ3GJ5k5vz43eDegJQYyh6PjYkkpbMoLZSwEzZm0N8B5B/4sJcxaJIq7qmDYigQrKghdFBUkNlKWQ5kgy7qpRGDlYqdWPsrNgRn/5t/9h4vpe2wu93Uq1veB9VfO15eKWnBmjzfqbMEKL1Z8ff/35r/XVVRn7X5y+sz0oOxE++rJGmSwrMsbSPMuLJKEsokWUZ0VJkzJOaU5pwpIki+M0itOkSJMY/+gtEhRqJdbR8h5LQrMUQyMaFxi4eKkv0j9u/A720G38ZRotNi5m8xa/8QdZT1Y8tXq0ijvQxpcDoXlMGCWMkSQAEQdS4csUR0IEG7hDHOZw4SxLJ64ebKtrF39+du1wO9O5e8gHGbbAO9uGtQLnu9uB+TqxPE06uOH9+HJDZI3Vn1McSKPNPTc11NPJ8ZVlQOMoiGMW0CJ1dK9hg9FWO2Br7fCtWxvrvEXkfNPT3f3fsekqUmYMO5OUWbAbCfDREhpAVwW85w9a8fsxELp/5ub9gyLWcAFEzhW40tqeUpLFRQZQRyQrWSMETdKojJpcpAmtgNGmmMs0bA2+mEg1gtgZIFjfHbZ4dFR0xuAkE+ytmqVe6gfZdTxMg8g7uuQC26PH9sT7CdvUeWjwfll7f3g0uqHpTX7srYahg9+h+iRtmLI8YJl39Onj9eXFwuvkLXjnIG71sfehNbqHECckiIKkTGmQJd6aN9zI5zAnhgsBwyzEwsGGre27BccUUvBpD8LDZPnu8Nbadyd3p1FQLmSPTwn5XjbPx3uohhfroLaL9+F7By3+QzDKrcIGwkG0XG3hZH9asZnxlSwCSugaV9Xp2z7IYeHV0HTcwmtUhww7zOdQoMhv6wWoF7InN+S9trCqa4Nb5VDLZYPfElcjYDRIsoCy/HkfJujnea5YUtJ4IujHWcJnbltPaes1eqdq7+jdm3V4d4wJ/acvT/8AUaLDiSEFAAA="
            }
        };
        const expectedDiscordPayload: DiscordWebhookPayload = buildPayload(3659, "GET", "/api/health/dne", JSON.stringify({}), "Path not found ('/api/health/dne')");

        axios.mockResolvedValueOnce({call: "successful"});
        return handler(expectedData).then((results) => {
            expect(axios).toHaveBeenCalledWith({
                method: "POST",
                url: process.env.DISCORD_WEBHOOK_URL,
                data: expectedDiscordPayload,
                timeout: 10000
            });
            expect(results.statusCode).toEqual(200);
            let discordPayload: DiscordWebhookPayload = JSON.parse(results.body);
            expect(discordPayload.embeds).toHaveLength(1);
            expect(discordPayload.embeds[0].fields).toHaveLength(5);
            expect(discordPayload.embeds[0].fields[0].name).toEqual("ID");
            expect(discordPayload.embeds[0].fields[0].value).toEqual("3659");
            expect(discordPayload.embeds[0].fields[1].name).toEqual("Request Type");
            expect(discordPayload.embeds[0].fields[1].value).toEqual("GET");
            expect(discordPayload.embeds[0].fields[2].name).toEqual("Request Path");
            expect(discordPayload.embeds[0].fields[2].value).toEqual("/api/health/dne");
            expect(discordPayload.embeds[0].fields[3].name).toEqual("Parameters");
            expect(discordPayload.embeds[0].fields[3].value).toEqual("{}");
            expect(discordPayload.embeds[0].fields[4].name).toEqual("Message");
            expect(discordPayload.embeds[0].fields[4].value).toEqual("Path not found ('/api/health/dne')");
        });
    })

    test('(Api Error - Failed to execute) - It should return a promise.', () => {
        const expectedData: CloudWatchLogsEvent = {
            awslogs: {
                data: "H4sIAAAAAAAAAG1T21LkNhD9FZdfFjYj27J8HYqHyYawyUJlw5DKbbYoWW6PVdiSkTXDLBT/nrYMFcLGL5a6T58+6suj38M48i1cfx3AX/o/rK5XN5dn6/Xq/Mxf+PpegUFzQbMyZkWcJ3GJ5k5vz43eDegJQYyh6PjYkkpbMoLZSwEzZm0N8B5B/4sJcxaJIq7qmDYigQrKghdFBUkNlKWQ5kgy7qpRGDlYqdWPsrNgRn/5t/9h4vpe2wu93Uq1veB9VfO15eKWnBmjzfqbMEKL1Z8ff/35r/XVVRn7X5y+sz0oOxE++rJGmSwrMsbSPMuLJKEsokWUZ0VJkzJOaU5pwpIki+M0itOkSJMY/+gtEhRqJdbR8h5LQrMUQyMaFxi4eKkv0j9u/A720G38ZRotNi5m8xa/8QdZT1Y8tXq0ijvQxpcDoXlMGCWMkSQAEQdS4csUR0IEG7hDHOZw4SxLJ64ebKtrF39+du1wO9O5e8gHGbbAO9uGtQLnu9uB+TqxPE06uOH9+HJDZI3Vn1McSKPNPTc11NPJ8ZVlQOMoiGMW0CJ1dK9hg9FWO2Br7fCtWxvrvEXkfNPT3f3fsekqUmYMO5OUWbAbCfDREhpAVwW85w9a8fsxELp/5ub9gyLWcAFEzhW40tqeUpLFRQZQRyQrWSMETdKojJpcpAmtgNGmmMs0bA2+mEg1gtgZIFjfHbZ4dFR0xuAkE+ytmqVe6gfZdTxMg8g7uuQC26PH9sT7CdvUeWjwfll7f3g0uqHpTX7srYahg9+h+iRtmLI8YJl39Onj9eXFwuvkLXjnIG71sfehNbqHECckiIKkTGmQJd6aN9zI5zAnhgsBwyzEwsGGre27BccUUvBpD8LDZPnu8Nbadyd3p1FQLmSPTwn5XjbPx3uohhfroLaL9+F7By3+QzDKrcIGwkG0XG3hZH9asZnxlSwCSugaV9Xp2z7IYeHV0HTcwmtUhww7zOdQoMhv6wWoF7InN+S9trCqa4Nb5VDLZYPfElcjYDRIsoCy/HkfJujnea5YUtJ4IujHWcJnbltPaes1eqdq7+jdm3V4d4wJ/acvT/8AUaLDiSEFAAA="
            }
        };
        const expectedDiscordPayload: DiscordWebhookPayload = buildPayload(3659, "GET", "/api/health/dne", JSON.stringify({}), "Path not found ('/api/health/dne')");

        axios.mockRejectedValue({call: "failed"});
        return handler(expectedData)
            .then((results) => expect(results).toBeFalsy())
            .catch((results) => {
                expect(axios).toHaveBeenCalledWith({
                    method: "POST",
                    url: process.env.DISCORD_WEBHOOK_URL,
                    data: expectedDiscordPayload,
                    timeout: 10000
                });
                expect(results.statusCode).toEqual(500);
                expect(results.body).toEqual("Failed to post to Discord with err.");
                expect(results.error).toEqual({call: "failed"});
            });
    })

    test('(Error - Failed to parse) - It should return a payload that message was unable to be parsed.', () => {
        const expectedData: CloudWatchLogsEvent = {
            awslogs: {
                data: "H"
            }
        };
        return handler(expectedData).then((results) => {
            expect(results).toBeFalsy();
        }).catch((error) => {
            expect(error.statusCode).toEqual(500);
            let discordPayload: DiscordWebhookPayload = JSON.parse(error.body);
            expect(discordPayload.embeds).toHaveLength(1);
            expect(discordPayload.embeds[0].fields).toHaveLength(2);
            expect(discordPayload.embeds[0].fields[0].name).toEqual("Failed");
            expect(discordPayload.embeds[0].fields[0].value).toEqual("Unable to parse log. Check Lambda.");
            expect(discordPayload.embeds[0].fields[1].name).toEqual("Exception");
        });
    })
})
