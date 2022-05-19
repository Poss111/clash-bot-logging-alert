import {handler} from "../index";

describe('Lambda Handler', () => {
    test('It should return a promise.', () => {
        return handler({Records: []}).then((results) => {
            expect(results.statusCode).toEqual(200);
        });
    })
})
