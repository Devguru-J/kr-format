# 변경 이력 (Changelog)

이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.2.0] - 2026-09-02

### 추가
- `validate` 네임스페이스: `phone`, `business`(국세청 체크섬), `rrn`, `card`(Luhn), `email`, `zipCode`
- `josa(word, josaType)`: 앞말 받침에 따라 `을/를`, `이/가`, `은/는`, `과/와`, `으로/로`, `아/야`, `이라/라`, `이었/였`, `이나/나`, `이며/며` 자동 결합. 한글·숫자·영문 끝소리 판별 지원 (`format.josa`로도 접근 가능)
- `format.koreanCurrency`: 조·억·만 단위 한국식 금액 표기 (예: `1억 2,345만원`)
- `format.dateKo`: `2024년 1월 15일` 형식, 요일 포함 옵션
- `format.time`: 24시간제 시각, 초 포함 옵션
- `format.relativeTime`: `3분 전`, `2일 후` 형태의 상대 시간
- `pad.phone(phone, { international: true })`: `+82-10-1234-5678` 국제 형식
- `pad.corp`: 법인등록번호(13자리) 포맷
- `pad.account`: 계좌번호 포맷 (은행별 자릿수 그룹 지정 가능)
- `mask.name`, `mask.card`(앞 6자리·뒤 4자리 노출), `mask.business`, `mask.account`
- `npm run build`: `index.js`에서 `index.esm.js`를 생성하는 빌드 스크립트

### 변경
- 모든 함수가 `null`/`undefined`/빈 문자열 입력에서 예외 없이 동작
- `format.fileSize`가 음수·비숫자 입력을 안전하게 처리하고 PB 단위까지 지원
- 타입 정의 정교화: `JosaType` 유니온, 옵션 인터페이스, nullable 시그니처 (`tsc --strict` 통과)
- 테스트 30개 → 121개, ESM 빌드 동기화 검증 테스트 추가
- CI 매트릭스를 Node 14~22로 갱신하고 ESM 빌드 최신 여부를 검사

## [1.1.0] - 2026-05-30

### 추가
- 전화번호 포맷 확장: 070(인터넷전화), 0507 평생번호(12자리), 1588/16xx/18xx 대표번호(8자리)
- GitHub Actions CI

### 변경
- `mask.rrn`을 한국 표준 마스킹(`900101-1******`)으로 변경, `visibleDigits` 옵션 제거
- `mask.phone`의 `maskLength` 인자가 실제로 동작하도록 수정

## [1.0.2] - 2025-12-27

### 추가
- ES Module 지원(`index.esm.js`)과 `exports` 필드로 Vite·Webpack 5+·Rollup 호환
- 패키지 매니저별 설치 안내와 Vite/React 예제

## [1.0.1]

- 초기 안정화 버전

## [1.0.0]

- 최초 릴리스
