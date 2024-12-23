// @ts-check

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*.ts'],
        exclude: ['tests/common.ts'],
    },
});
