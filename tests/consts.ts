import { values } from 'aisenv';
import { describe, expect, test } from 'vitest';
import { exec } from './common.js';

describe('consts', () => {
    test.concurrent('USER_ID', async () => {
        await expect(exec('<: USER_ID')).resolves.toStrictEqual(values.NULL);
        await expect(
            exec('<: USER_ID', {
                constMocks: {
                    USER_ID: '0000000000000000',
                },
            }),
        ).resolves.toStrictEqual(values.STR('0000000000000000'));
    });

    test.concurrent('USER_NAME', async () => {
        await expect(exec('<: USER_NAME')).resolves.toStrictEqual(values.NULL);
        await expect(
            exec('<: USER_NAME', {
                constMocks: {
                    USER_NAME: '藍',
                },
            }),
        ).resolves.toStrictEqual(values.STR('藍'));
    });

    test.concurrent('USER_USERNAME', async () => {
        await expect(exec('<: USER_USERNAME')).resolves.toStrictEqual(
            values.NULL,
        );
        await expect(
            exec('<: USER_USERNAME', {
                constMocks: {
                    USER_USERNAME: 'ai',
                },
            }),
        ).resolves.toStrictEqual(values.STR('ai'));
    });

    test.concurrent('CUSTOM_EMOJIS', async () => {
        await expect(exec('<: CUSTOM_EMOJIS')).resolves.toStrictEqual(
            values.NULL,
        );
        await expect(
            exec('<: CUSTOM_EMOJIS', {
                constMocks: {
                    CUSTOM_EMOJIS: [
                        {
                            aliases: [],
                            name: 'igyo',
                            category: null,
                            url: 'https://example.com/files/00000000-0000-0000-0000-000000000000',
                        },
                    ],
                },
            }),
        ).resolves.toStrictEqual(
            values.ARR([
                values.OBJ(
                    new Map<string, values.Value>([
                        ['aliases', values.ARR([])],
                        ['name', values.STR('igyo')],
                        ['category', values.NULL],
                        [
                            'url',
                            values.STR(
                                'https://example.com/files/00000000-0000-0000-0000-000000000000',
                            ),
                        ],
                    ]),
                ),
            ]),
        );
    });

    test.concurrent('LOCALE', async () => {
        await expect(exec('<: LOCALE')).resolves.toStrictEqual(
            values.STR('ja-JP'),
        );
        await expect(
            exec('<: LOCALE', {
                constMocks: {
                    LOCALE: 'en-US',
                },
            }),
        ).resolves.toStrictEqual(values.STR('en-US'));
    });

    test.concurrent('SERVER_URL', async () => {
        await expect(exec('<: SERVER_URL')).resolves.toStrictEqual(
            values.STR('.'),
        );
        await expect(
            exec('<: SERVER_URL', {
                constMocks: {
                    SERVER_URL: 'https://example.com',
                },
            }),
        ).resolves.toStrictEqual(values.STR('https://example.com'));
    });

    test.concurrent('Mk:nyaize', async () => {
        await expect(exec('<: Mk:nyaize("な")')).resolves.toStrictEqual(
            values.STR('にゃ'),
        );
    });

    test.concurrent('Mk:save, Mk:load', async () => {
        const res = await exec(`
        Mk:save('a', 1)
        <: Mk:load('a')
        `);
        expect(res).toStrictEqual(values.NUM(1));
    });
});
