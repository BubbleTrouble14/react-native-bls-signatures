import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-bls-signatures' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ChiaBlsSignatures = NativeModules.BlsSignatures;

if (ChiaBlsSignatures == null) {
  throw new Error(LINKING_ERROR);
}

const result = ChiaBlsSignatures.install();

if (!result) {
  throw new Error(
    `Failed to create a new BLS Signatures instance: The native BLS Signatures Module could not be installed! Looks like something went wrong when installing JSI bindings: ${result}`
  );
}

export { PrivateKey } from './types/PrivateKey';
export { AugSchemeMPL } from './types/schemes/AugSchemeMPL';
export { G1Element } from './types/elements/G1Element';
export { G2Element } from './types/elements/G2Element';
