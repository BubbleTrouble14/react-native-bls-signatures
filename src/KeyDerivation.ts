import { AugSchemeMPL } from 'react-native-bls-signatures';
import type { IPrivateKey } from './Bls';

export const blsSpecNumber = 12381;
export const chiaBlockchainNumber = 8444;
export const farmerPathNumber = 0;
export const poolPathNumber = 1;
export const walletPathNumber = 2;
export const localPathNumber = 3;
export const backupKeyPathNumber = 4;
export const singletonPathNumber = 5;
export const poolingAuthenticationPathNumber = 6;

function derivePath(sk: IPrivateKey, path: number[]) {
  return path.reduce(
    (acc, curr) => AugSchemeMPL().deriveChildSk(acc, curr),
    sk
  );
}

function derivePathUnhardend(sk: IPrivateKey, path: number[]) {
  return path.reduce(
    (acc, curr) => AugSchemeMPL().deriveChildSkUnhardened(acc, curr),
    sk
  );
}

function masterSkToFarmerSk(masterSk: IPrivateKey) {
  return derivePath(masterSk, [
    blsSpecNumber,
    chiaBlockchainNumber,
    farmerPathNumber,
    0,
  ]);
}

function masterSkToPoolSk(masterSk: IPrivateKey) {
  return derivePath(masterSk, [
    blsSpecNumber,
    chiaBlockchainNumber,
    poolPathNumber,
    0,
  ]);
}

function masterSkToWalletSk(masterSk: IPrivateKey, index: number) {
  return derivePath(masterSk, [
    blsSpecNumber,
    chiaBlockchainNumber,
    walletPathNumber,
    index,
  ]);
}

function masterSkToWalletSkUnhardened(masterSk: IPrivateKey, index: number) {
  return derivePathUnhardend(masterSk, [
    blsSpecNumber,
    chiaBlockchainNumber,
    walletPathNumber,
    index,
  ]);
}

function masterSkToLocalSk(masterSk: IPrivateKey) {
  return derivePath(masterSk, [
    blsSpecNumber,
    chiaBlockchainNumber,
    localPathNumber,
    0,
  ]);
}

function masterSkToBackupSk(masterSk: IPrivateKey) {
  return derivePath(masterSk, [
    blsSpecNumber,
    chiaBlockchainNumber,
    backupKeyPathNumber,
    0,
  ]);
}

function masterSkToSingletonOwnerSk(
  masterSk: IPrivateKey,
  poolWalletIndex: number
) {
  return derivePath(masterSk, [
    blsSpecNumber,
    chiaBlockchainNumber,
    singletonPathNumber,
    poolWalletIndex,
  ]);
}

function masterSkToPoolingAuthenticationSk(
  masterSk: IPrivateKey,
  poolWalletIndex: number,
  index: number
) {
  return derivePath(masterSk, [
    blsSpecNumber,
    chiaBlockchainNumber,
    poolingAuthenticationPathNumber,
    poolWalletIndex * 10000 + index,
  ]);
}

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
};
