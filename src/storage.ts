import { Keyv } from 'keyv';
import { KeyvSqlite } from '@keyv/sqlite';

export type Key = `aiscript:${string}`;

export interface Options {
    inMemory?: boolean;
}

export class Storage {
    private readonly keyv: Keyv<string>;

    constructor(opts: Options) {
        if (opts.inMemory) {
            this.keyv = new Keyv<string>();
        } else {
            this.keyv = new Keyv<string>(
                new KeyvSqlite({ uri: 'sqlite://storage.sqlite' }),
            );
        }
    }

    async getItem(key: Key): Promise<string | null> {
        return (await this.keyv.get(key)) ?? null;
    }

    async setItem(key: Key, value: string): Promise<void> {
        const result = await this.keyv.set(key, value);
        if (!result) {
            throw new StorageError();
        }
    }
}

export class StorageError extends Error {
    static {
        this.prototype.name = 'StorageError';
    }

    public constructor() {
        super('failed to set an item to the store');
    }
}
