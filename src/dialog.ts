import { styleText } from 'node:util';
import { errors } from 'aisenv';
import * as readline from 'node:readline/promises';
import * as loading from './loading.js';

const dialogTypes = [
    'error',
    'info',
    'success',
    'warning',
    'waiting',
    'question',
] as const;

export type DialogType = (typeof dialogTypes)[number];

export interface DialogProps {
    type: DialogType;
    title: string;
    text: string;
}

export function checkDialogType(value: string): DialogType {
    const result = dialogTypes.find((validValue) => validValue == value);
    if (result == null) {
        throw new errors.AiScriptTypeError(`invalid dialog type: ${value}`);
    }
    return result;
}

export async function alert({ type, title, text }: DialogProps): Promise<void> {
    await prompt(buildMessage(title, text) + ' [Enter] ', type);
}

export async function confirm({
    type,
    title,
    text,
}: DialogProps): Promise<boolean> {
    let answer = await prompt(buildMessage(title, text) + ' [y/n] ', type);
    while (true) {
        switch (answer) {
            case 'y': {
                return true;
            }
            case 'n': {
                return false;
            }
        }
        answer = await prompt(
            styleText('redBright', 'invalid option') + ' [y/n] ',
            type,
        );
    }
}

function buildMessage(title: string, text: string): string {
    return `${styleText('bold', title)}  ${text}`;
}

async function prompt(message: string, type: DialogType): Promise<string> {
    if (type == 'waiting') {
        return loading.prompt(message);
    } else {
        return promptSimple(message, type);
    }
}

async function promptSimple(
    message: string,
    type: Exclude<DialogType, 'waiting'>,
) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const icon = toIcon(type);
    const answer = await rl.question(`${icon} ${message}`);
    rl.close();
    return answer;
}

function toIcon(type: Exclude<DialogType, 'waiting'>): string {
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
        case 'question': {
            return '?';
        }
        default: {
            (type) satisfies never;
            throw new TypeError(`unhandled dialog type: ${type}`);
        }
    }
}
