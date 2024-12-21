import { Addon } from 'aisenv';
import { consts, Options } from './consts.js';

export default (opts?: Options): Addon => {
    return {
        name: 'aisenv',
        consts: consts(opts),
    };
};
