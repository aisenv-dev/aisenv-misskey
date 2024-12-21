import { Interpreter, Parser, values } from 'aisenv';
import { consts } from '../src/consts';

export async function exec(script: string): Promise<values.Value | undefined> {
    let result: values.Value | undefined;
    const interpreter = new Interpreter(consts({ inMemoryStorage: true }), {
        out(value) {
            result = value;
        },
    });
    const ast = Parser.parse(script);
    await interpreter.exec(ast);
    return result;
}
