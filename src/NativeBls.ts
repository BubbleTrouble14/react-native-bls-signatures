import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  install(): boolean;
}

const BlsInstaller = TurboModuleRegistry.getEnforcing<Spec>('Bls');

console.log('Loading react-native-bls...');

if (global.BlsApi === undefined || global.BlsApi == null) {
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
  console.log('react-native-bls installed.');
}
