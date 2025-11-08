const { pad, mask, format } = require('./index');

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

// 전화번호 테스트
test('휴대폰 번호 (11자리)', pad.phone('01012345678'), '010-1234-5678');
test('휴대폰 번호 (숫자)', pad.phone(1012345678), '010-1234-5678');
test('서울 전화번호 (9자리)', pad.phone('021234567'), '02-123-4567');
test('서울 전화번호 (10자리)', pad.phone('0212345678'), '02-1234-5678');
test('지역 전화번호 (10자리)', pad.phone('0311234567'), '031-123-4567');

// 사업자등록번호 테스트
test('사업자등록번호', pad.business('1234567890'), '123-45-67890');
test('사업자등록번호 (숫자)', pad.business(1234567890), '123-45-67890');

// 카드번호 테스트
test('카드번호 (16자리)', pad.card('1234567890123456'), '1234-5678-9012-3456');

console.log('\n=== MASK 테스트 ===\n');

// 주민등록번호 마스킹
test('주민등록번호 (전체 마스킹)', mask.rrn('9001011234567'), '900101-*******');
test('주민등록번호 (뒷자리 1개 표시)', mask.rrn('9001011234567', 1), '900101-******7');
test('주민등록번호 (하이픈 포함)', mask.rrn('900101-1234567'), '900101-*******');

// 전화번호 마스킹
test('전화번호 마스킹', mask.phone('01012345678'), '010-****-5678');

// 이메일 마스킹
test('이메일 마스킹', mask.email('test@example.com'), 'te**@example.com');
test('긴 이메일 마스킹', mask.email('verylongemail@example.com'), 'ver**********@example.com');

console.log('\n=== FORMAT 테스트 ===\n');

// 통화 포맷
test('통화 (원 포함)', format.currency(1234567), '1,234,567원');
test('통화 (원 미포함)', format.currency(1234567, false), '1,234,567');
test('통화 (음수)', format.currency(-1234567), '-1,234,567원');

// 숫자 포맷
test('숫자 포맷', format.number(1234567), '1,234,567');
test('숫자 포맷 (음수)', format.number(-1234567), '-1,234,567');

// 날짜 포맷
test('날짜 포맷 (기본)', format.date('2024-01-15'), '2024.01.15');
test('날짜 포맷 (커스텀)', format.date('2024-01-15', '-'), '2024-01-15');
test('날짜 포맷 (슬래시)', format.date('2024-01-15', '/'), '2024/01/15');

// 파일 크기 포맷
test('파일 크기 (바이트)', format.fileSize(512), '512B');
test('파일 크기 (KB)', format.fileSize(1024), '1.0KB');
test('파일 크기 (MB)', format.fileSize(1048576), '1.0MB');
test('파일 크기 (GB)', format.fileSize(1073741824), '1.0GB');

console.log('\n=== 테스트 결과 ===\n');
console.log(`통과: ${passed}`);
console.log(`실패: ${failed}`);
console.log(`총: ${passed + failed}`);

process.exit(failed > 0 ? 1 : 0);
