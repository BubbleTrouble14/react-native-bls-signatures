const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/lib/typescript/types/PrivateKey.d.ts');
const data = fs.readFileSync(filePath, 'utf-8');

// Remove the getCppPrivateKey function
const result = data.replace(/\s+getCppPrivateKey\(\): CppPrivateKey;?/g, '');

fs.writeFileSync(filePath, result, 'utf-8');

const filePathG1 = path.join(
  __dirname,
  '/lib/typescript/types/elements/G1Element.d.ts'
);
const dataG1 = fs.readFileSync(filePathG1, 'utf-8');

// Remove the getCppG1Element function
const resultG1 = dataG1.replace(/\s+getCppG1Element\(\): CppG1Element;?/g, '');

fs.writeFileSync(filePathG1, resultG1, 'utf-8');

const filePathG2 = path.join(
  __dirname,
  '/lib/typescript/types/elements/G2Element.d.ts'
);
const dataG2 = fs.readFileSync(filePathG2, 'utf-8');

// Remove the getCppG2Element function
const resultG2 = dataG2.replace(/\s+getCppG2Element\(\): CppG2Element;?/g, '');

fs.writeFileSync(filePathG2, resultG2, 'utf-8');
