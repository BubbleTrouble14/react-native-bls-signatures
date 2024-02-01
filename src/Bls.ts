/*global BlsApi*/
import type { Bls as BlsApi } from './types';

/**
 * Declares the BlsApi as an available object in the global scope
 */
declare global {
  var BlsApi: BlsApi;
}

export const Bls = BlsApi;
