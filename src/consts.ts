import { utils, values } from 'aisenv';
import * as Misskey from 'misskey-js';
import { alert, checkDialogType, confirm } from './dialog.js';

export function consts() {
    return {
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

        'Mk:nyaize': values.FN_NATIVE(([text]) => {
            utils.assertString(text);
            return values.STR(Misskey.nyaize(text.value));
        }),
    };
}
