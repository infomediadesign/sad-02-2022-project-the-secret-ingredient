import { uuid } from './deps.ts';

async function prompt(message: string = '') {
    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode(message + ': '));
    const n = <number>await Deno.stdin.read(buf);
    return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

const uid = uuid.v1.generate();

console.log(uid);

const input = await prompt('\nFinished\n');
