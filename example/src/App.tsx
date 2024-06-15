import * as React from 'react';
import { AugSchemeMPL } from 'react-native-bls-signatures';
import { Root } from './navigators/Root';

export default function App() {
  React.useEffect(() => {
    const seed = Uint8Array.from([
      0, 50, 6, 244, 24, 199, 1, 25, 52, 88, 192, 19, 18, 12, 89, 6, 220, 18,
      102, 58, 209, 82, 12, 62, 89, 110, 182, 9, 44, 20, 254, 22,
    ]);
    const sk = AugSchemeMPL.keyGen(seed);
    const pk = sk.getG1();
    const g2 = sk.getG2();
    const message = Uint8Array.from([1, 2, 3, 4, 5]);
    AugSchemeMPL.verify(pk, message, g2);
    // Bls.PopSchemeMPL.verify(pk, message, new G1Element('fsdf'));
    // Bls.BasicSchemeMPL.verify(pk, message, new G1Element('sdfsdf'));

    // Bls.AugSchemeMPL.verify(pk, message, G1Element.fromHex('0x1'));
  }, []);

  return <Root />;
}
