// @ts-check

import aisenvMk from 'aisenv-mk';

/** @type {import('aisenv').Config} */
export default ({
    addons: [aisenvMk({
        inMemoryStorage: true,
    })],
});
