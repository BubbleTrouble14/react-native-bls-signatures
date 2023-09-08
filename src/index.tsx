import { NativeModules, Platform } from 'react-native';
import type {
  NativeAugSchemeMPL,
  NativeG1Element,
  NativePrivateKey,
} from './Bls';

import {
  derivePath,
  derivePathUnhardend,
  masterSkToBackupSk,
  masterSkToFarmerSk,
  masterSkToLocalSk,
  masterSkToPoolSk,
  masterSkToPoolingAuthenticationSk,
  masterSkToSingletonOwnerSk,
  masterSkToWalletSk,
  masterSkToWalletSkUnhardened,
  blsSpecNumber,
  chiaBlockchainNumber,
  farmerPathNumber,
  poolPathNumber,
  walletPathNumber,
  localPathNumber,
  backupKeyPathNumber,
  singletonPathNumber,
  poolingAuthenticationPathNumber,
} from './KeyDerivation';

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

export const AugSchemeMPL = (): NativeAugSchemeMPL => {
  // @ts-expect-error
  if (global.AugSchemeMPL == null)
    throw new Error(
      'Failed to create a new AugSchemeMPL instance, the native initializer function does not exist. Are you trying to use AugSchemeMPL from different JS Runtimes?'
    );
  // @ts-expect-error
  const buffer = global.AugSchemeMPL() as NativeAugSchemeMPL;
  return buffer;
};

export const PrivateKey = (): NativePrivateKey => {
  // @ts-expect-error
  if (global.PrivateKey == null)
    throw new Error(
      'Failed to create a new PrivateKey instance, the native initializer function does not exist. Are you trying to use PrivateKey from different JS Runtimes?'
    );
  // @ts-expect-error
  const buffer = global.PrivateKey() as NativePrivateKey;
  return buffer;
};

export const G1Element = (): NativeG1Element => {
  // @ts-expect-error
  if (global.G1Element == null)
    throw new Error(
      'Failed to create a new G1Element instance, the native initializer function does not exist. Are you trying to use PrivateKey from different JS Runtimes?'
    );
  // @ts-expect-error
  const buffer = global.G1Element() as NativeG1Element;
  return buffer;
};

export {
  derivePath,
  derivePathUnhardend,
  masterSkToBackupSk,
  masterSkToFarmerSk,
  masterSkToLocalSk,
  masterSkToPoolSk,
  masterSkToPoolingAuthenticationSk,
  masterSkToSingletonOwnerSk,
  masterSkToWalletSk,
  masterSkToWalletSkUnhardened,
  blsSpecNumber,
  chiaBlockchainNumber,
  farmerPathNumber,
  poolPathNumber,
  walletPathNumber,
  localPathNumber,
  backupKeyPathNumber,
  singletonPathNumber,
  poolingAuthenticationPathNumber,
};
