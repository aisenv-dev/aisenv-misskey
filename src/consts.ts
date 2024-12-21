import { errors, utils, values } from 'aisenv';
import * as Misskey from 'misskey-js';
import { alert, checkDialogType, confirm } from './dialog.js';
import { Storage } from './storage.js';

export interface EmojiSimple {
    aliases: string[];
    name: string;
    category: string | null;
    url: string;
    localOnly?: boolean;
    isSensitive?: boolean;
    roleIdsThatCanBeUsedThisEmojiAsReaction?: string[];
}

export interface Options {
    inMemoryStorage?: boolean;
    storageKey?: string;
    constMocks?: {
        USER_ID?: string;
        USER_NAME?: string;
        USER_USERNAME?: string;
        CUSTOM_EMOJIS?: EmojiSimple[];
        LOCALE?: string;
        SERVER_URL?: string;
    };
}

export function consts(opts?: Options): Record<string, values.Value> {
    const storage = new Storage({ inMemory: opts?.inMemoryStorage });
    const storageKey = opts?.storageKey ?? 'widget';
    const constsMock = opts?.constMocks ?? {};
    const {
        USER_ID,
        USER_NAME,
        USER_USERNAME,
        CUSTOM_EMOJIS,
        LOCALE,
        SERVER_URL,
    } = constsMock;

    return {
        USER_ID: USER_ID ? values.STR(USER_ID) : values.NULL,
        USER_NAME: USER_NAME ? values.STR(USER_NAME) : values.NULL,
        USER_USERNAME: USER_USERNAME ? values.STR(USER_USERNAME) : values.NULL,
        CUSTOM_EMOJIS: CUSTOM_EMOJIS
            ? utils.jsToVal(CUSTOM_EMOJIS)
            : values.NULL,
        LOCALE: values.STR(LOCALE ?? 'ja-JP'),
        SERVER_URL: values.STR(SERVER_URL ?? '.'),

        'Mk:dialog': values.FN_NATIVE(async ([title, text, type]) => {
            utils.assertString(title);
            utils.assertString(text);
            if (type != null) {
                utils.assertString(type);
            }
            await alert({
                type: type ? checkDialogType(type.value) : 'info',
                title: title.value,
                text: text.value,
            });
            return values.NULL;
        }),

        'Mk:confirm': values.FN_NATIVE(async ([title, text, type]) => {
            utils.assertString(title);
            utils.assertString(text);
            if (type != null) {
                utils.assertString(type);
            }
            const answer = await confirm({
                type: type ? checkDialogType(type.value) : 'question',
                title: title.value,
                text: text.value,
            });
            return answer ? values.TRUE : values.FALSE;
        }),

        'Mk:save': values.FN_NATIVE(async ([key, value]) => {
            utils.assertString(key);
            if (value == null) {
                throw new errors.AiScriptRuntimeError(
                    'expected value, but nothing found',
                );
            }
            await storage.setItem(
                `aiscript:${storageKey}:${key.value}`,
                JSON.stringify(utils.valToJs(value)),
            );
            return values.NULL;
        }),

        'Mk:load': values.FN_NATIVE(async ([key]) => {
            utils.assertString(key);
            const item = await storage.getItem(
                `aiscript:${storageKey}:${key.value}`,
            );
            if (item == null) {
                return values.NULL;
            }
            return utils.jsToVal(JSON.parse(item));
        }),

        'Mk:nyaize': values.FN_NATIVE(([text]) => {
            utils.assertString(text);
            return values.STR(Misskey.nyaize(text.value));
        }),
    };
}
