# kr-format

> 한국 개발자를 위한 필수 포맷팅 유틸리티

간단하고 직관적인 API로 한국에서 자주 사용하는 데이터 형식을 쉽게 포맷팅하고 마스킹할 수 있습니다.

## 설치

### npm
```bash
npm install kr-format
```

### yarn
```bash
yarn add kr-format
```

### pnpm
```bash
pnpm add kr-format
```

### bun
```bash
bun add kr-format
```

### deno
```typescript
import { pad, mask, format } from "npm:kr-format";
```

## 사용법

### ES Modules (Vite, React, Vue, 최신 번들러)
```javascript
import { pad, mask, format } from 'kr-format';
```

### CommonJS (Node.js, 레거시 프로젝트)
```javascript
const { pad, mask, format } = require('kr-format');
```

### Vite/React 프로젝트에서 사용
```jsx
import { pad, mask, format } from 'kr-format';

function App() {
  const phoneNumber = '01012345678';

  return (
    <div>
      <p>전화번호: {pad.phone(phoneNumber)}</p>
      <p>마스킹: {mask.phone(phoneNumber)}</p>
      <p>가격: {format.currency(50000)}</p>
    </div>
  );
}
```

### Deno에서 사용
```typescript
import { pad, mask, format } from "npm:kr-format";

const phoneNumber = pad.phone("01012345678");
console.log(phoneNumber); // 010-1234-5678

const price = format.currency(50000);
console.log(price); // 50,000원
```

### Bun에서 사용
```typescript
import { pad, mask, format } from "kr-format";

const email = mask.email("test@example.com");
console.log(email); // te**@example.com
```

## API

### 📱 pad - 데이터 포맷팅

#### `pad.phone(phone)`
전화번호를 하이픈으로 구분된 형식으로 변환합니다.

```javascript
pad.phone('01012345678')    // '010-1234-5678'
pad.phone('0212345678')     // '02-1234-5678'
pad.phone('0311234567')     // '031-123-4567'
```

#### `pad.business(business)`
사업자등록번호를 표준 형식으로 변환합니다.

```javascript
pad.business('1234567890')  // '123-45-67890'
```

#### `pad.card(card)`
카드번호를 4자리씩 구분합니다.

```javascript
pad.card('1234567890123456')  // '1234-5678-9012-3456'
```

### 🔒 mask - 민감정보 마스킹

#### `mask.rrn(rrn, visibleDigits?)`
주민등록번호를 마스킹 처리합니다.

```javascript
mask.rrn('9001011234567')     // '900101-*******'
mask.rrn('900101-1234567', 1) // '900101-******7'
```

#### `mask.phone(phone, maskLength?)`
전화번호 중간 자리를 마스킹합니다.

```javascript
mask.phone('01012345678')  // '010-****-5678'
```

#### `mask.email(email)`
이메일 주소를 마스킹합니다.

```javascript
mask.email('test@example.com')  // 'te**@example.com'
```

### 💰 format - 숫자 및 날짜 포맷팅

#### `format.currency(amount, withUnit?)`
숫자를 한국 통화 형식으로 변환합니다.

```javascript
format.currency(1234567)        // '1,234,567원'
format.currency(1234567, false) // '1,234,567'
format.currency(-500000)        // '-500,000원'
```

#### `format.number(number)`
숫자를 천 단위 쉼표로 구분합니다.

```javascript
format.number(1234567)  // '1,234,567'
```

#### `format.date(date, separator?)`
날짜를 한국 형식으로 변환합니다.

```javascript
format.date('2024-01-15')       // '2024.01.15'
format.date('2024-01-15', '-')  // '2024-01-15'
format.date('2024-01-15', '/')  // '2024/01/15'
```

#### `format.fileSize(bytes)`
파일 크기를 읽기 쉬운 형식으로 변환합니다.

```javascript
format.fileSize(1024)       // '1.0KB'
format.fileSize(1048576)    // '1.0MB'
format.fileSize(1073741824) // '1.0GB'
```

## TypeScript 지원

이 패키지는 TypeScript 타입 정의를 포함하고 있습니다.

```typescript
import { pad, mask, format } from 'kr-format';

const phoneNumber: string = pad.phone('01012345678');
const maskedEmail: string = mask.email('test@example.com');
const price: string = format.currency(10000);
```

## 호환성

### 번들러 & 런타임
- ✅ **ES Modules** - Vite, Webpack 5+, Rollup, esbuild
- ✅ **CommonJS** - Node.js, Webpack 4, 레거시 프로젝트
- ✅ **TypeScript** - 타입 정의 포함
- ✅ **React/Vue/Svelte** - 모든 모던 프레임워크
- ✅ **Node.js** - 12.0.0 이상
- ✅ **Deno** - npm 스펙을 통한 지원
- ✅ **Bun** - 네이티브 지원

### 패키지 매니저
- ✅ **npm** - Node Package Manager
- ✅ **yarn** - Fast, reliable package manager
- ✅ **pnpm** - Fast, disk space efficient
- ✅ **bun** - Ultra-fast JavaScript runtime & package manager

## 실사용 예제

### 고객 정보 표시
```javascript
const customer = {
  name: '홍길동',
  phone: '01012345678',
  rrn: '9001011234567',
  email: 'hong@example.com'
};

console.log(`
이름: ${customer.name}
전화: ${pad.phone(customer.phone)}
주민번호: ${mask.rrn(customer.rrn)}
이메일: ${mask.email(customer.email)}
`);

// 출력:
// 이름: 홍길동
// 전화: 010-1234-5678
// 주민번호: 900101-*******
// 이메일: hon*@example.com
```

### 주문 정보 포맷팅
```javascript
const order = {
  orderNo: '20240115001',
  amount: 125000,
  date: '2024-01-15',
  card: '1234567890123456'
};

console.log(`
주문번호: ${order.orderNo}
금액: ${format.currency(order.amount)}
날짜: ${format.date(order.date)}
카드: ${mask.card(order.card)}
`);
```

## 테스트

```bash
npm test
```

## 변경 이력 (Changelog)

### v1.0.2 (2025-12-27)
- ✨ **Vite 호환성 추가**: ES Module 지원으로 Vite, Webpack 5+, Rollup 등 모던 번들러와 완벽 호환
- 📦 **Dual Package 지원**: CommonJS와 ES Module 동시 지원으로 레거시 및 모던 프로젝트 모두 사용 가능
- 🎯 **package.json exports 필드 추가**: 번들러가 자동으로 적절한 모듈 형식 선택
- 📝 **README 개선**:
  - 모든 주요 패키지 매니저 설치 방법 추가 (npm, yarn, pnpm, bun, deno)
  - Vite/React 사용 예제 추가
  - 호환성 정보 명시
- 🔧 **index.esm.js 추가**: ES Module 전용 진입점

### v1.0.1
- 초기 안정화 버전

### v1.0.0
- 최초 릴리스

## 라이선스

MIT

## 기여

이슈와 PR은 언제나 환영합니다!

## left-pad처럼 간단하고 필수적인 유틸리티

이 패키지는 한국 개발자들이 매일 반복적으로 작성하는 코드를 간단한 함수로 제공합니다.
복잡한 정규식이나 로직 없이 단 한 줄로 한국 특화 데이터를 포맷팅하세요!

---

**Project tango down by Devguru-J**
