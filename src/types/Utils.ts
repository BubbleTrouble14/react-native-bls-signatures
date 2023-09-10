declare global {
  function hash256(msg: Uint8Array): Uint8Array;
  function toHex(msg: Uint8Array): string;
  function fromHex(hex: string): Uint8Array;
  function getRandomSeed(): Uint8Array;
}

export const hash256 = (msg: Uint8Array): Uint8Array => {
  if (global.hash256 == null)
    throw new Error(
      'Failed to create a new hash256 instance, the native initializer function does not exist. Are you trying to use hash256 from different JS Runtimes?'
    );
  return global.hash256(msg);
};

export const toHex = (bytes: Uint8Array): string => {
  if (global.toHex == null)
    throw new Error(
      'Failed to create a new toHex instance, the native initializer function does not exist. Are you trying to use toHex from different JS Runtimes?'
    );
  return global.toHex(bytes);
};

export const fromHex = (hex: string): Uint8Array => {
  if (global.fromHex == null)
    throw new Error(
      'Failed to create a new fromHex instance, the native initializer function does not exist. Are you trying to use fromHex from different JS Runtimes?'
    );
  return global.fromHex(hex);
};

export const getRandomSeed = (): Uint8Array => {
  if (global.getRandomSeed == null)
    throw new Error(
      'Failed to create a new getRandomSeed instance, the native initializer function does not exist. Are you trying to use getRandomSeed from different JS Runtimes?'
    );
  return global.getRandomSeed();
};
