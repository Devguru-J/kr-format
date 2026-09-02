# kr-format

> 한국 개발자를 위한 필수 포맷팅·마스킹·검증 유틸리티

간단하고 직관적인 API로 한국에서 자주 쓰는 데이터 형식을 포맷팅·마스킹하고, 유효성까지 검증할 수 있습니다. 의존성 0개.

```javascript
pad.phone('01012345678')            // '010-1234-5678'
mask.rrn('9001011234567')           // '900101-1******'
format.koreanCurrency(123450000)    // '1억 2,345만원'
validate.business('220-81-62517')   // true
josa('사과', '을')                   // '사과를'
```

## 🆕 v1.2.0에서 새로워진 점

**함수 10개 → 27개.** 포맷팅만 하던 라이브러리에서, 검증과 한국어 문장 조립까지 하는 라이브러리가 됐습니다.

### 1. 이제 "검증"까지 됩니다 — `validate`

기존에는 포맷만 바꿔줄 뿐, 그 값이 진짜인지는 각자 정규식을 짜야 했습니다. 이제 한 줄입니다.

```javascript
// 전 (직접 짜던 코드)
const BIZ_WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5];
function checkBusinessNumber(no) { /* 체크섬 20여 줄... */ }

// 후
validate.business('220-81-62517')      // true  (국세청 체크섬)
validate.card('4242-4242-4242-4242')   // true  (Luhn)
validate.phone('015-1234-5678')        // false (없는 국번)
validate.rrn('900230-1234567')         // false (2월 30일)
validate.email('test@example')         // false
validate.zipCode('06236')              // true
```

### 2. 한글 조사 자동 결합 — `josa`

`${name}이(가) 로그인했습니다` 같은 어색한 표기가 사라집니다.

```javascript
// 전
`${userName}이(가) 등록되었습니다.`      // '홍길동이(가) 등록되었습니다.'

// 후
`${josa(userName, '이')} 등록되었습니다.`  // '홍길동이 등록되었습니다.'
josa('사과', '을')     // '사과를'
josa('서울', '으로')   // '서울로'  (ㄹ 받침 예외까지)
josa('1', '으로')      // '1로'     (숫자 발음 기준)
```

### 3. 실무에서 매번 다시 짜던 포맷들

```javascript
format.koreanCurrency(123450000)   // '1억 2,345만원'  (금액을 눈으로 읽기 쉽게)
format.relativeTime(writtenAt)     // '3분 전'         (게시글·알림 목록)
format.dateKo('2024-01-15', true)  // '2024년 1월 15일 월요일'
format.time(new Date())            // '14:05'
```

### 4. 마스킹 대상 확대 — 개인정보 화면 대응

```javascript
mask.name('홍길동')                 // '홍*동'
mask.card('1234567890123456')      // '1234-56**-****-3456'  (앞6·뒤4, PCI 표기 관행)
mask.business('1234567890')        // '123-45-6****'
mask.account('123456-78-901234')   // '******-**-**1234'     (하이픈 위치 유지)
```

### 5. 포맷 추가 — 국제 전화·법인번호·계좌번호

```javascript
pad.phone('01012345678', { international: true })  // '+82-10-1234-5678'
pad.corp('1101111234567')                          // '110111-1234567'
pad.account('12345678901234', [6, 2, 6])           // '123456-78-901234'
```

### 6. 더 안전해졌습니다

- **`null` / `undefined` / 빈 문자열**을 넣어도 예외 없이 동작합니다. (기존에는 `String(null)` → `'null'` 같은 결과가 나올 수 있었습니다)
- **타입이 정교해졌습니다.** `JosaType` 유니온 덕분에 조사 오타는 컴파일 단계에서 잡히고, 옵션 인자도 전부 타입이 붙습니다. `tsc --strict` 통과.
- **CJS/ESM 로직 불일치 차단.** `index.esm.js`를 `index.js`에서 자동 생성하도록 바꾸고, 두 파일이 어긋나면 테스트가 실패합니다.
- **테스트 30개 → 121개**, CI는 Node 14~22에서 검증합니다.

> 기존 API는 그대로입니다. v1.1.0에서 올라올 때 고칠 코드는 없습니다.

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
import { pad, mask, format, validate } from "npm:kr-format";
```

## 사용법

### ES Modules (Vite, React, Vue, 최신 번들러)
```javascript
import { pad, mask, format, validate, josa } from 'kr-format';
```

### CommonJS (Node.js, 레거시 프로젝트)
```javascript
const { pad, mask, format, validate, josa } = require('kr-format');
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

#### `pad.phone(phone, options?)`
전화번호를 하이픈으로 구분된 형식으로 변환합니다. `options.international`을 켜면 +82 국제 형식으로 반환합니다.

```javascript
pad.phone('01012345678')    // '010-1234-5678'
pad.phone('07012345678')    // '070-1234-5678'
pad.phone('050712345678')   // '0507-1234-5678' (평생번호)
pad.phone('0212345678')     // '02-1234-5678'
pad.phone('0311234567')     // '031-123-4567'
pad.phone('15881234')       // '1588-1234' (대표번호)

pad.phone('01012345678', { international: true })  // '+82-10-1234-5678'
pad.phone('0212345678', { international: true })   // '+82-2-1234-5678'
```

#### `pad.business(business)`
사업자등록번호를 표준 형식으로 변환합니다.

```javascript
pad.business('1234567890')  // '123-45-67890'
```

#### `pad.corp(corp)`
법인등록번호(13자리)를 표준 형식으로 변환합니다.

```javascript
pad.corp('1101111234567')  // '110111-1234567'
```

#### `pad.card(card)`
카드번호를 4자리씩 구분합니다.

```javascript
pad.card('1234567890123456')  // '1234-5678-9012-3456'
```

#### `pad.account(account, groups?)`
계좌번호를 하이픈으로 구분합니다. 은행마다 자릿수 규칙이 달라, 그룹을 지정하지 않으면 4자리씩 끊습니다.

```javascript
pad.account('12345678901234')            // '1234-5678-9012-34'
pad.account('12345678901234', [6, 2, 6]) // '123456-78-901234'
```

### 🔒 mask - 민감정보 마스킹

#### `mask.rrn(rrn)`
주민등록번호를 한국 표준 방식으로 마스킹합니다 (생년월일 + 성별자리만 노출).

```javascript
mask.rrn('9001011234567')   // '900101-1******'
mask.rrn('900101-1234567')  // '900101-1******'
```

#### `mask.phone(phone, maskLength?)`
전화번호 가운데 자리를 앞쪽부터 `maskLength`(기본 4)만큼 마스킹합니다.

```javascript
mask.phone('01012345678')     // '010-****-5678'
mask.phone('01012345678', 2)  // '010-**34-5678'
```

#### `mask.email(email)`
이메일 주소를 마스킹합니다.

```javascript
mask.email('test@example.com')  // 'te**@example.com'
```

#### `mask.name(name)`
이름의 가운데 글자를 가립니다. 두 글자 이름은 마지막 글자를 가립니다.

```javascript
mask.name('홍길동')    // '홍*동'
mask.name('김철')      // '김*'
mask.name('남궁민수')  // '남**수'
```

#### `mask.card(card)`
카드번호를 앞 6자리·뒤 4자리만 남기고 마스킹합니다 (PCI DSS 표기 관행).

```javascript
mask.card('1234567890123456')  // '1234-56**-****-3456'
```

#### `mask.business(business)`
사업자등록번호 뒤 4자리를 가립니다.

```javascript
mask.business('1234567890')  // '123-45-6****'
```

#### `mask.account(account)`
계좌번호를 뒤 4자리만 남기고 마스킹합니다. 입력에 하이픈이 있으면 위치를 유지합니다.

```javascript
mask.account('123456-78-901234')  // '******-**-**1234'
mask.account('12345678901234')    // '**********1234'
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

#### `format.koreanCurrency(amount, withUnit?)`
금액을 조·억·만 단위의 한국식 표기로 변환합니다.

```javascript
format.koreanCurrency(123450000)      // '1억 2,345만원'
format.koreanCurrency(50000)          // '5만원'
format.koreanCurrency(10500)          // '1만 500원'
format.koreanCurrency(50000, false)   // '5만'
```

#### `format.dateKo(date, withWeekday?)`
날짜를 '2024년 1월 15일' 형식으로 변환합니다.

```javascript
format.dateKo('2024-01-15')        // '2024년 1월 15일'
format.dateKo('2024-01-15', true)  // '2024년 1월 15일 월요일'
```

#### `format.time(date, withSeconds?)`
시각을 24시간제로 변환합니다.

```javascript
format.time(new Date(2024, 0, 15, 14, 5, 30))        // '14:05'
format.time(new Date(2024, 0, 15, 14, 5, 30), true)  // '14:05:30'
```

#### `format.relativeTime(date, baseDate?)`
기준 시각(기본: 현재) 대비 상대 시간을 한국어로 표시합니다.

```javascript
const base = new Date('2024-01-15T12:00:00');

format.relativeTime('2024-01-15T11:57:00', base)  // '3분 전'
format.relativeTime('2024-01-13T12:00:00', base)  // '2일 전'
format.relativeTime('2024-01-17T12:00:00', base)  // '2일 후'
```

#### `format.fileSize(bytes)`
파일 크기를 읽기 쉬운 형식으로 변환합니다.

```javascript
format.fileSize(1024)       // '1.0KB'
format.fileSize(1048576)    // '1.0MB'
format.fileSize(1073741824) // '1.0GB'
```

### 🔤 josa - 한글 조사 자동 결합

앞말의 받침에 따라 알맞은 조사를 골라 붙입니다. `josa`로도, `format.josa`로도 쓸 수 있습니다.

```javascript
josa('사과', '을')    // '사과를'
josa('수박', '을')    // '수박을'
josa('의자', '이')    // '의자가'
josa('서울', '으로')  // '서울로'   (ㄹ 받침 예외 처리)
josa('집', '로')      // '집으로'
josa('1', '으로')     // '1로'      (숫자 발음 기준)
josa('3', '을')       // '3을'

`${josa(userName, '이')} 로그인했습니다.`
```

지원 조사: `을/를`, `이/가`, `은/는`, `과/와`, `으로/로`, `아/야`, `이라/라`, `이었/였`, `이나/나`, `이며/며`.
영문은 마지막 글자의 알파벳 이름 발음을 기준으로 판단합니다(`Excel은`, `Java는`).

### ✅ validate - 유효성 검증

#### `validate.phone(phone)`
국번·자릿수 기준으로 전화번호 형식을 검증합니다.

```javascript
validate.phone('010-1234-5678')  // true
validate.phone('1588-1234')      // true
validate.phone('015-1234-5678')  // false
```

#### `validate.business(business)`
국세청 체크섬으로 사업자등록번호를 검증합니다.

```javascript
validate.business('220-81-62517')  // true
validate.business('123-45-67890')  // false
```

#### `validate.rrn(rrn, options?)`
주민등록번호의 생년월일·성별코드를 검증합니다.

```javascript
validate.rrn('900101-1234567')  // true  (형식·생년월일·성별코드)
validate.rrn('901301-1234567')  // false (13월)
validate.rrn('900230-1234567')  // false (2월 30일)
```

> ⚠️ `{ checksum: true }`를 주면 검증번호까지 확인하지만, **2020년 10월 이후 발급된 주민등록번호는 뒤 6자리가 임의번호**라 이 검증식이 성립하지 않습니다. 실제 서비스에서는 기본값(형식 검증)을 권장합니다.

#### `validate.card(card)`
Luhn 알고리즘으로 카드번호를 검증합니다.

```javascript
validate.card('4242-4242-4242-4242')  // true
validate.card('4242424242424241')     // false
```

#### `validate.email(email)` / `validate.zipCode(zipCode)`

```javascript
validate.email('test@example.com')  // true
validate.email('test@example')      // false
validate.zipCode('06236')           // true  (5자리 신 우편번호)
validate.zipCode('135-080')         // false (구 6자리)
```

## TypeScript 지원

이 패키지는 TypeScript 타입 정의를 포함하고 있습니다.

```typescript
import { pad, mask, format, validate, josa, JosaType } from 'kr-format';

const phoneNumber: string = pad.phone('01012345678');
const international: string = pad.phone('01012345678', { international: true });
const maskedEmail: string = mask.email('test@example.com');
const price: string = format.koreanCurrency(123450000);
const isValid: boolean = validate.business('220-81-62517');
const sentence: string = josa('사과', '을');
```

`JosaType`은 지원 조사만 허용하는 유니온 타입이라, 오타는 컴파일 단계에서 잡힙니다.

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
// 주민번호: 900101-1******
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
npm test    # 121개 테스트
npm run build   # index.js -> index.esm.js 재생성
```

`index.esm.js`는 `index.js`에서 자동 생성됩니다. 로직은 `index.js`만 수정하고 `npm run build`를 실행하세요 (테스트가 두 파일의 동기화를 검증합니다).

## 변경 이력 (Changelog)

### v1.2.1 (2026-09-02)
- 🔧 `exports`에 `./package.json` 추가 — `kr-format/package.json` 접근이 막히던 문제 수정
- 🔧 `repository.url` 정규화 (`git+https://`)

### v1.2.0 (2026-09-02)
- ✨ **`validate` 네임스페이스 추가**: 전화번호·사업자등록번호(체크섬)·주민등록번호·카드번호(Luhn)·이메일·우편번호 검증
- ✨ **`josa` 추가**: 앞말 받침에 따라 `을/를`, `이/가`, `으로/로` 등 10쌍의 조사를 자동 결합 (한글·숫자·영문 지원)
- ✨ **포맷 함수 추가**: `format.koreanCurrency`(1억 2,345만원), `format.dateKo`, `format.time`, `format.relativeTime`(3분 전)
- ✨ **`pad` 확장**: `pad.phone`의 `{ international: true }`(+82 형식), `pad.corp`(법인등록번호), `pad.account`(계좌번호)
- 🔒 **마스킹 확장**: `mask.name`, `mask.card`(앞6·뒤4 노출), `mask.business`, `mask.account`
- 🛡️ **입력 방어 강화**: `null`/`undefined`/빈 문자열 입력에서 예외 없이 안전하게 동작
- 🔧 **ESM 빌드 자동화**: `index.esm.js`를 `index.js`에서 생성하는 `npm run build` 도입, 두 파일의 로직 drift를 테스트로 차단
- 📘 **타입 정교화**: `JosaType` 유니온, 옵션 인터페이스, `null`/`undefined` 허용 시그니처 (`tsc --strict` 통과)
- 🧪 테스트 30 → 121개로 확대, CI 매트릭스 Node 14~22로 갱신

### v1.1.0 (2026-05-30)
- ✨ **전화번호 포맷 확장**: 070(인터넷전화), 0507 평생번호(12자리), 1588/16xx/18xx 대표번호(8자리) 지원
- 🔒 **`mask.rrn` 한국 표준 마스킹**: 생년월일+성별자리만 노출(`900101-1******`)하도록 변경. 끝자리 노출 가능성이 있던 `visibleDigits` 옵션 제거
- 🔧 **`mask.phone` `maskLength` 동작 수정**: 무시되던 인자가 실제로 가운데 자리 마스킹 길이를 제어
- ✅ **GitHub Actions CI 추가**: Node 12~20 매트릭스 테스트
- 🧪 테스트 26 → 30개로 확대

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
