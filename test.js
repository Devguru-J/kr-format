const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pad, mask, format, validate, josa } = require('./index');

// 테스트 헬퍼
let passed = 0;
let failed = 0;

function test(description, actual, expected) {
  if (actual === expected) {
    console.log(`✓ ${description}`);
    passed++;
  } else {
    console.log(`✗ ${description}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual: ${actual}`);
    failed++;
  }
}

console.log('=== PAD 테스트 ===\n');

// 전화번호
test('휴대폰 번호 (11자리)', pad.phone('01012345678'), '010-1234-5678');
test('휴대폰 번호 (숫자)', pad.phone(1012345678), '010-1234-5678');
test('휴대폰 번호 (하이픈 포함 입력)', pad.phone('010-1234-5678'), '010-1234-5678');
test('서울 전화번호 (9자리)', pad.phone('021234567'), '02-123-4567');
test('서울 전화번호 (10자리)', pad.phone('0212345678'), '02-1234-5678');
test('지역 전화번호 (10자리)', pad.phone('0311234567'), '031-123-4567');
test('인터넷 전화 070 (11자리)', pad.phone('07012345678'), '070-1234-5678');
test('평생번호 050X (12자리)', pad.phone('050712345678'), '0507-1234-5678');
test('대표번호 1588 (8자리)', pad.phone('15881234'), '1588-1234');
test('대표번호 1644 (8자리)', pad.phone('16441234'), '1644-1234');
test('전화번호 (빈 값)', pad.phone(''), '');
test('전화번호 (null)', pad.phone(null), '');
test('전화번호 (국제 형식)', pad.phone('01012345678', { international: true }), '+82-10-1234-5678');
test('전화번호 (국제 형식, 서울)', pad.phone('0212345678', { international: true }), '+82-2-1234-5678');
test('전화번호 (국제 형식, 대표번호)', pad.phone('15881234', { international: true }), '+82-1588-1234');

// 사업자등록번호
test('사업자등록번호', pad.business('1234567890'), '123-45-67890');
test('사업자등록번호 (숫자)', pad.business(1234567890), '123-45-67890');

// 법인등록번호
test('법인등록번호', pad.corp('1101111234567'), '110111-1234567');

// 카드번호
test('카드번호 (16자리)', pad.card('1234567890123456'), '1234-5678-9012-3456');
test('카드번호 (15자리 아멕스)', pad.card('123456789012345'), '1234-5678-9012-345');

// 계좌번호
test('계좌번호 (기본 4자리)', pad.account('12345678901234'), '1234-5678-9012-34');
test('계좌번호 (그룹 지정)', pad.account('12345678901234', [6, 2, 6]), '123456-78-901234');
test('계좌번호 (그룹보다 긴 입력)', pad.account('1234567890123456', [6, 2, 6]), '123456-78-901234-56');
test('계좌번호 (빈 값)', pad.account(null), '');

console.log('\n=== MASK 테스트 ===\n');

// 주민등록번호 (표준: 성별자리만 노출)
test('주민등록번호 (성별자리 노출)', mask.rrn('9001011234567'), '900101-1******');
test('주민등록번호 (하이픈 포함)', mask.rrn('900101-1234567'), '900101-1******');
test('주민등록번호 (잘못된 길이)', mask.rrn('900101'), '900101');

// 전화번호
test('전화번호 마스킹 (기본)', mask.phone('01012345678'), '010-****-5678');
test('전화번호 마스킹 (maskLength 2)', mask.phone('01012345678', 2), '010-**34-5678');
test('전화번호 마스킹 (지역번호)', mask.phone('0311234567'), '031-***-4567');
test('전화번호 마스킹 (대표번호는 그대로)', mask.phone('15881234'), '1588-1234');

// 이메일
test('이메일 마스킹', mask.email('test@example.com'), 'te**@example.com');
test('긴 이메일 마스킹', mask.email('verylongemail@example.com'), 'ver**********@example.com');
test('이메일 마스킹 (이메일 아님)', mask.email('not-an-email'), 'not-an-email');

// 이름
test('이름 마스킹 (3글자)', mask.name('홍길동'), '홍*동');
test('이름 마스킹 (2글자)', mask.name('김철'), '김*');
test('이름 마스킹 (4글자)', mask.name('남궁민수'), '남**수');
test('이름 마스킹 (1글자)', mask.name('김'), '김');

// 카드번호
test('카드번호 마스킹 (16자리)', mask.card('1234567890123456'), '1234-56**-****-3456');
test('카드번호 마스킹 (하이픈 입력)', mask.card('1234-5678-9012-3456'), '1234-56**-****-3456');

// 사업자등록번호
test('사업자등록번호 마스킹', mask.business('1234567890'), '123-45-6****');

// 계좌번호
test('계좌번호 마스킹 (하이픈 유지)', mask.account('123456-78-901234'), '******-**-**1234');
test('계좌번호 마스킹 (숫자만)', mask.account('12345678901234'), '**********1234');

console.log('\n=== FORMAT 테스트 ===\n');

// 통화
test('통화 (원 포함)', format.currency(1234567), '1,234,567원');
test('통화 (원 미포함)', format.currency(1234567, false), '1,234,567');
test('통화 (음수)', format.currency(-1234567), '-1,234,567원');

// 한국식 통화 단위
test('한국식 통화 (억/만)', format.koreanCurrency(123450000), '1억 2,345만원');
test('한국식 통화 (만 단위)', format.koreanCurrency(50000), '5만원');
test('한국식 통화 (단위 미포함)', format.koreanCurrency(50000, false), '5만');
test('한국식 통화 (조 단위)', format.koreanCurrency(1234000000000), '1조 2,340억원');
test('한국식 통화 (나머지 포함)', format.koreanCurrency(10500), '1만 500원');
test('한국식 통화 (0)', format.koreanCurrency(0), '0원');
test('한국식 통화 (음수)', format.koreanCurrency(-50000), '-5만원');

// 숫자
test('숫자 포맷', format.number(1234567), '1,234,567');
test('숫자 포맷 (음수)', format.number(-1234567), '-1,234,567');

// 날짜/시각
test('날짜 포맷 (기본)', format.date('2024-01-15'), '2024.01.15');
test('날짜 포맷 (커스텀)', format.date('2024-01-15', '-'), '2024-01-15');
test('날짜 포맷 (슬래시)', format.date('2024-01-15', '/'), '2024/01/15');
test('날짜 포맷 (잘못된 값)', format.date('not-a-date'), 'not-a-date');
test('한국식 날짜', format.dateKo('2024-01-15'), '2024년 1월 15일');
test('한국식 날짜 (요일 포함)', format.dateKo('2024-01-15', true), '2024년 1월 15일 월요일');
test('시각 (시:분)', format.time(new Date(2024, 0, 15, 14, 5, 30)), '14:05');
test('시각 (초 포함)', format.time(new Date(2024, 0, 15, 14, 5, 30), true), '14:05:30');

// 상대 시간
const base = new Date('2024-01-15T12:00:00');
test('상대 시간 (방금)', format.relativeTime(new Date('2024-01-15T11:59:30'), base), '방금 전');
test('상대 시간 (분)', format.relativeTime(new Date('2024-01-15T11:57:00'), base), '3분 전');
test('상대 시간 (시간)', format.relativeTime(new Date('2024-01-15T09:00:00'), base), '3시간 전');
test('상대 시간 (일)', format.relativeTime(new Date('2024-01-13T12:00:00'), base), '2일 전');
test('상대 시간 (개월)', format.relativeTime(new Date('2023-11-15T12:00:00'), base), '2개월 전');
test('상대 시간 (년)', format.relativeTime(new Date('2022-01-15T12:00:00'), base), '2년 전');
test('상대 시간 (미래)', format.relativeTime(new Date('2024-01-17T12:00:00'), base), '2일 후');

// 파일 크기
test('파일 크기 (바이트)', format.fileSize(512), '512B');
test('파일 크기 (KB)', format.fileSize(1024), '1.0KB');
test('파일 크기 (MB)', format.fileSize(1048576), '1.0MB');
test('파일 크기 (GB)', format.fileSize(1073741824), '1.0GB');
test('파일 크기 (0)', format.fileSize(0), '0B');
test('파일 크기 (잘못된 값)', format.fileSize('abc'), 'abc');

console.log('\n=== JOSA 테스트 ===\n');

test('조사 (받침 있음, 을)', josa('수박', '을'), '수박을');
test('조사 (받침 없음, 를)', josa('사과', '을'), '사과를');
test('조사 (받침 있음, 이)', josa('책', '가'), '책이');
test('조사 (받침 없음, 가)', josa('의자', '이'), '의자가');
test('조사 (받침 있음, 은)', josa('사람', '는'), '사람은');
test('조사 (받침 없음, 는)', josa('나무', '은'), '나무는');
test('조사 (ㄹ 받침, 로)', josa('서울', '으로'), '서울로');
test('조사 (받침 있음, 으로)', josa('집', '로'), '집으로');
test('조사 (받침 없음, 로)', josa('학교', '으로'), '학교로');
test('조사 (숫자 1, 받침 ㄹ)', josa('1', '으로'), '1로');
test('조사 (숫자 3, 받침 있음)', josa('3', '을'), '3을');
test('조사 (숫자 2, 받침 없음)', josa('2', '을'), '2를');
test('조사 (영문 자음 끝, 받침 있음)', josa('Excel', '은'), 'Excel은');
test('조사 (영문 모음, 받침 없음)', josa('Java', '은'), 'Java는');
test('조사 (format.josa 동일)', format.josa('사과', '을'), '사과를');
test('조사 (알 수 없는 조사)', josa('사과', '에서'), '사과에서');

console.log('\n=== VALIDATE 테스트 ===\n');

// 전화번호
test('전화번호 검증 (휴대폰)', validate.phone('010-1234-5678'), true);
test('전화번호 검증 (서울)', validate.phone('02-123-4567'), true);
test('전화번호 검증 (경기)', validate.phone('031-123-4567'), true);
test('전화번호 검증 (대표번호)', validate.phone('1588-1234'), true);
test('전화번호 검증 (평생번호)', validate.phone('0507-1234-5678'), true);
test('전화번호 검증 (잘못된 국번)', validate.phone('015-1234-5678'), false);
test('전화번호 검증 (자릿수 부족)', validate.phone('010-1234'), false);
test('전화번호 검증 (빈 값)', validate.phone(''), false);

// 사업자등록번호 (실존 체크섬 사례)
test('사업자등록번호 검증 (유효)', validate.business('220-81-62517'), true);
test('사업자등록번호 검증 (무효)', validate.business('123-45-67890'), false);
test('사업자등록번호 검증 (자릿수 부족)', validate.business('12345'), false);

// 주민등록번호
test('주민등록번호 검증 (형식)', validate.rrn('900101-1234567'), true);
test('주민등록번호 검증 (없는 월)', validate.rrn('901301-1234567'), false);
test('주민등록번호 검증 (없는 날짜 2월 30일)', validate.rrn('900230-1234567'), false);
test('주민등록번호 검증 (윤년 2월 29일)', validate.rrn('000229-3234567'), true);
test('주민등록번호 검증 (잘못된 성별코드)', validate.rrn('900101-9234567'), false);
test('주민등록번호 검증 (체크섬 유효)', validate.rrn('900101-1234568', { checksum: true }), true);
test('주민등록번호 검증 (체크섬 무효)', validate.rrn('900101-1234567', { checksum: true }), false);

// 카드번호 (Luhn 테스트 번호)
test('카드번호 검증 (유효)', validate.card('4242424242424242'), true);
test('카드번호 검증 (무효)', validate.card('4242424242424241'), false);
test('카드번호 검증 (자릿수 부족)', validate.card('42424242'), false);

// 이메일
test('이메일 검증 (유효)', validate.email('test@example.com'), true);
test('이메일 검증 (서브도메인)', validate.email('a.b@mail.co.kr'), true);
test('이메일 검증 (@ 없음)', validate.email('test.example.com'), false);
test('이메일 검증 (도메인 점 없음)', validate.email('test@example'), false);
test('이메일 검증 (빈 값)', validate.email(''), false);

// 우편번호
test('우편번호 검증 (5자리)', validate.zipCode('06236'), true);
test('우편번호 검증 (구 6자리)', validate.zipCode('135-080'), false);

console.log('\n=== BUILD 동기화 테스트 ===\n');

// index.esm.js가 index.js에서 생성된 최신 상태인지 확인
const esmPath = path.join(__dirname, 'index.esm.js');
const before = fs.readFileSync(esmPath, 'utf8');
execFileSync(process.execPath, [path.join(__dirname, 'scripts', 'build-esm.js')], { stdio: 'ignore' });
const after = fs.readFileSync(esmPath, 'utf8');
test('index.esm.js가 index.js와 동기화됨', before, after);

console.log('\n=== 테스트 결과 ===\n');
console.log(`통과: ${passed}`);
console.log(`실패: ${failed}`);
console.log(`총: ${passed + failed}`);

process.exit(failed > 0 ? 1 : 0);
