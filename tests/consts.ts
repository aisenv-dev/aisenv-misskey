import { Interpreter, Parser, values } from 'aisenv';
import { describe, expect, test } from 'vitest';
import { consts } from '../src/consts.js';

async function exec(script: string): Promise<values.Value | undefined> {
    let result: values.Value | undefined;
    const interpreter = new Interpreter(consts(), {
        out(value) {
            result = value;
        },
    });
    const ast = Parser.parse(script);
    await interpreter.exec(ast);
    return result;
}

describe('consts', () => {
    test.concurrent('Mk:nyaize', async () => {
        await expect(exec('<: Mk:nyaize("な")')).resolves.toStrictEqual(
            values.STR('にゃ'),
        );
    });
});
