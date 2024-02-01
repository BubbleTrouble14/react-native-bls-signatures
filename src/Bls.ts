import type { Bls as BlsApi } from './types/Bls';

/**
 * Declares the BlsApi as an available object in the global scope
 */
declare global {
  var BlsApi: BlsApi;
}
