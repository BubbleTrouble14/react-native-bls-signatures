import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  install(): boolean;
}

const BlsInstaller = TurboModuleRegistry.getEnforcing<Spec>('Bls');

console.log('Loading react-native-bls-signatures...');

declare global {
  var Bls: any;
}

if (global.Bls === undefined || global.Bls == null) {
  if (BlsInstaller == null || typeof BlsInstaller.install !== 'function') {
    console.error(
      'Native Bls Module cannot be found! Make sure you correctly ' +
        'installed native dependencies and rebuilt your app.'
    );
  } else {
    // Install the module
    const result = BlsInstaller.install();
    if (result !== true) {
      console.error(
        `Native Bls Module failed to correctly install JSI Bindings! Result: ${result}`
      );
    } else {
      console.log('Bls loaded successfully');
    }
  }
} else {
  console.log('react-native-worklets-core installed.');
}

// import { NativeModules, Platform } from 'react-native';

// const LINKING_ERROR =
//   `The package 'react-native-bls-signatures' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo managed workflow\n';

// const ChiaBlsSignatures = NativeModules.BlsSignatures;

// if (ChiaBlsSignatures == null) {
//   throw new Error(LINKING_ERROR);
// }

// const result = ChiaBlsSignatures.install();

// if (!result) {
//   throw new Error(
//     `Failed to create a new BLS Signatures instance: The native BLS Signatures Module could not be installed! Looks like something went wrong when installing JSI bindings: ${result}`
//   );
// }

// export { PrivateKey } from './types/PrivateKey';
// export { AugSchemeMPL } from './types/schemes/AugSchemeMPL';
// export { PopSchemeMPL } from './types/schemes/PopSchemeMPL';
// export { BasicSchemeMPL } from './types/schemes/BasicSchemeMPL';
// export { G1Element } from './types/elements/G1Element';
// export { G2Element } from './types/elements/G2Element';
// export { hash256, fromHex, getRandomSeed, toHex } from './types/Utils';
