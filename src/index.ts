import { Addon } from 'aisenv';
import { consts } from './consts.js';

export default (): Addon => {
    return {
        name: 'aisenv',
        consts: consts(),
    };
};
