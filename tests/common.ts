import { Interpreter, Parser, values } from 'aisenv';
import { consts, Options } from '../src/consts';

export async function exec(
    script: string,
    opts: Options = {},
): Promise<values.Value | undefined> {
    let result: values.Value | undefined;
    opts = {
        ...opts,
        inMemoryStorage: true,
    };
    const interpreter = new Interpreter(consts(opts), {
        out(value) {
            result = value;
        },
    });
    const ast = Parser.parse(script);
    await interpreter.exec(ast);
    return result;
}
