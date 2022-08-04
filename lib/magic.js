import { Magic } from '@magic-sdk/admin';

export const mAdmin = new Magic(process.env.MAGIC_SECRET_KEY);
