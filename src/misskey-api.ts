export function createMisskeyApi(apiUrl: string) {
    return async (
        endpoint: string,
        data: { i?: string | null },
        token: string | null,
    ): Promise<unknown> => {
        if (endpoint.includes('://')) throw new Error('invalid endpoint');

        if (token != null) {
            data.i = token;
        }

        // Send request
        const res = await fetch(`${apiUrl}/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(data),
            credentials: 'omit',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const body = res.status === 204 ? null : await res.json();
        if (res.status === 200) {
            return body;
        } else if (res.status === 204) {
            return;
        } else {
            throw body.error;
        }
    };
}
