import * as readline from 'node:readline/promises';
import { styleText } from 'node:util';

const animationFrames = ['◜', '◝', '◞', '◟'];
const ANIMATION_DURATION = 500;

export async function prompt(message: string): Promise<string> {
    let frameIndex = 0;
    const intervalId = setInterval(() => {
        const frame = animationFrames[frameIndex]!;
        process.stdout.write(`\r${styleText('greenBright', frame)} ${message}`);
        frameIndex = (frameIndex + 1) % animationFrames.length;
    }, ANIMATION_DURATION / animationFrames.length);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answer = await rl.question('');
    clearInterval(intervalId);
    rl.close();
    return answer;
}
