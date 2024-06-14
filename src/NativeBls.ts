import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Bls } from './types/Bls';
import type { UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';
import { ModuleNotFoundError } from './ModuleNotFoundError';

if (__DEV__) {
  console.log('Loading react-native-bls-signatures...');
}

export interface Spec extends TurboModule {
  /**
   * Create a new instance of the Bls API.
   * The returned {@linkcode UnsafeObject} is a `jsi::HostObject`.
   */
  createBlsApi(): UnsafeObject;
}

let module: Spec;
try {
  // Try to find the CxxTurboModule.
  // CxxTurboModules can be autolinked on Android starting from react-native 0.74,
  // and are manually linked in BlsOnLoad.mm on iOS.
  module = TurboModuleRegistry.getEnforcing<Spec>('BlsCxx');
} catch (e) {
  // User didn't enable new arch, or the module does not exist.
  throw new ModuleNotFoundError(e);
}

/**
 * The Bls API.
 * This object can be shared and accessed from multiple contexts,
 * however it is advised to not hold unnecessary references to it.
 */
export const bls = module.createBlsApi() as Bls;

if (__DEV__) {
  console.log('react-native-bls-signatures loaded successfully!');
}
