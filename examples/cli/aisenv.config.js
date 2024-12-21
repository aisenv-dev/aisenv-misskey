// @ts-check

import aisenvMisskey from 'aisenv-misskey';

/** @type {import('aisenv').Config} */
export default ({
    addons: [aisenvMisskey({
        inMemoryStorage: true,
    })],
});
