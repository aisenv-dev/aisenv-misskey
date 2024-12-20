import { utils, values } from "aisenv";
import * as Misskey from "misskey-js";

export function consts() {
    return {
        "Mk:nyaize": values.FN_NATIVE(([text]) => {
            utils.assertString(text);
            return values.STR(Misskey.nyaize(text.value));
        }),
    };
}
