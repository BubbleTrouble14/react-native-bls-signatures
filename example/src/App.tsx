import * as React from 'react';
import { Root } from './navigators/Root';
import { bip39 } from '@ronickg/react-native-bip39';
import { AugSchemeMPL } from 'react-native-bls-signatures';

export default function App() {
  React.useEffect(() => {
    console.log(bip39.generateMnemonic());
    const seed = Uint8Array.from([
      0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18,
      102, 58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
    ]);
    const sk = AugSchemeMPL.keyGen(seed.buffer);
    console.log(sk.toHex());

    // console.log(sk.toHex());
    // const pk = sk.getG1();
    // const g2 = sk.getG2();
    // const message = Uint8Array.from([1, 2, 3, 4, 5]).buffer;
    // AugSchemeMPL.verify(pk, message, g2);
    // PopSchemeMPL.verify(pk, message, new G1Element('fsdf'));
    // BasicSchemeMPL.verify(pk, message, new G1Element('sdfsdf'));
    // Bls.AugSchemeMPL.verify(pk, message, G1Element.fromHex('0x1'));
  }, []);

  // React.useEffect(() => {
  //   // const buffer = new ArrayBuffer(3);
  //   const dataWriter = Uint8Array.from([1, 100, 255]);
  //   storage.set('someToken', dataWriter);

  //   const buffer1 = storage.getBuffer('someToken');
  //   console.log(buffer1); // [1, 100, 255]
  // }, []);

  return <Root />;
}
