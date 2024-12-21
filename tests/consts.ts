import { values } from 'aisenv';
import { describe, expect, test } from 'vitest';
import { exec } from './common.js';

describe('consts', () => {
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
