/**
 * index.js(CommonJS)에서 index.esm.js(ES Module)를 생성한다.
 * 두 파일의 로직이 어긋나지 않도록 ESM 빌드는 항상 이 스크립트로 만든다.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.js'), 'utf8');

const exported = ['pad', 'mask', 'format', 'validate'];

let esm = source;

// 공개 API 선언에 export를 붙인다
for (const name of exported) {
  const declaration = `const ${name} = {`;
  if (!esm.includes(declaration)) {
    throw new Error(`index.js에서 '${declaration}' 선언을 찾지 못했습니다.`);
  }
  esm = esm.replace(declaration, `export ${declaration}`);
}

// josa는 화살표 함수 선언이라 별도로 처리
esm = esm.replace('const josa = (word, josaType) => {', 'export const josa = (word, josaType) => {');

// CommonJS export 구문 제거
esm = esm.replace(/\n?module\.exports = \{[^}]*\};\n?/, '\n');

if (esm.includes('module.exports')) {
  throw new Error('module.exports 구문이 남아 있습니다.');
}

fs.writeFileSync(path.join(root, 'index.esm.js'), esm.trimEnd() + '\n');
console.log('index.esm.js 생성 완료');
