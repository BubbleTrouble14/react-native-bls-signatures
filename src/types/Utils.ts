export const hash256 = (msg: Uint8Array): Uint8Array => {
  return global.BlsApi.hash256(msg);
};

export const toHex = (bytes: Uint8Array): string => {
  return global.BlsApi.toHex(bytes);
};

export const fromHex = (hex: string): Uint8Array => {
  return global.BlsApi.fromHex(hex);
};

export const getRandomSeed = (): Uint8Array => {
  return global.BlsApi.getRandomSeed();
};
