import { styleText } from 'node:util';
import { errors } from 'aisenv';
import * as readline from 'node:readline/promises';

const dialogTypes = ['error', 'info', 'success', 'warning', 'waiting', 'question'] as const;

export type DialogType = typeof dialogTypes[number];

export interface DialogProps {
    type: DialogType,
    title: string,
    text: string,
};

export function checkDialogType(value: string): DialogType {
    const result = dialogTypes.find((validValue) => validValue == value);
    if (result == null) {
        throw new errors.AiScriptTypeError(`invalid dialog type: ${value}`);
    }
    return result;
}

export async function alert(props: DialogProps): Promise<void> {
    await prompt(buildMessage(props) + ' [Enter] ');
}

export async function confirm(props: DialogProps): Promise<boolean> {
    let answer = await prompt(buildMessage(props) + ' [y/n] ');
    while (true) {
        switch (answer) {
            case 'y': {
                return true;
            }
            case 'n': {
                return false;
            }
        }
        answer = await prompt('invalid option [y/n] ');
    }
}

function buildMessage(props: DialogProps): string {
    const { type, title, text } = props;
    return `${toIcon(type)}  ${styleText('bold', title)}  ${text}`;
}

async function prompt(message: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answer = await rl.question(message);
    rl.close();
    return answer;
}

function toIcon(type: DialogType): string {
    switch (type) {
        case 'error': {
            return styleText('redBright', '✗');
        }
        case 'info': {
            return styleText('cyanBright', 'i');
        }
        case 'success': {
            return styleText('greenBright', '✓');
        }
        case 'warning': {
            return styleText('yellowBright', '⚠');
        }
        case 'waiting': {
            throw new Error('not yet implemented');
        }
        case 'question': {
            return '?';
        }
        default: {
            (type satisfies never);
            throw new TypeError(`unhandled dialog type: ${type}`);
        }
    }
}
