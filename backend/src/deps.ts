export * as Immutable from 'https://deno.land/x/immutable@4.0.0-rc.14-deno/mod.ts';
export * as Oak from 'https://deno.land/x/oak@v10.6.0/mod.ts';
export * as Mongo from 'https://deno.land/x/mongo@v0.30.0/mod.ts';
export { create } from 'https://deno.land/x/djwt@$v2.4/mod.ts';

export * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';

export const key = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-512' }, true, ['sign', 'verify']);
export const jwt = await create({ alg: 'HS512', typ: 'JWT' }, { foo: 'bar' }, key);
