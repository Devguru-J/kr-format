/**
 * kr-format - 한국 개발자를 위한 필수 포맷팅 유틸리티
 */

/** 입력을 문자열로 정규화 (null/undefined -> '') */
const toStr = (value) => (value === null || value === undefined ? '' : String(value));

/** 숫자만 남긴 문자열 반환 */
const digits = (value) => toStr(value).replace(/\D/g, '');

/**
 * 한글 한 글자의 종성 인덱스를 반환
 * @param {string} char - 검사할 글자
 * @returns {number|null} 종성 인덱스(0 = 받침 없음, 8 = ㄹ), 한글이 아니면 null
 */
const finalConsonant = (char) => {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  return code % 28;
};

// 숫자/영문 끝소리의 받침 여부 (받침 있으면 종성 인덱스, 없으면 0)
const TAIL_BY_DIGIT = { 0: 1, 1: 8, 2: 0, 3: 16, 4: 0, 5: 0, 6: 8, 7: 1, 8: 8, 9: 0 };
const TAIL_BY_ALPHABET = {
  l: 8, m: 16, n: 4, r: 8, // ㄹ, ㅁ, ㄴ, ㄹ
  b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0,
  a: 0, o: 0, p: 0, q: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0
};

/** 단어 끝 글자의 종성 인덱스 (판별 불가 시 null) */
const tailOf = (word) => {
  const trimmed = toStr(word).trim();
  if (!trimmed) return null;
  const last = trimmed[trimmed.length - 1];

  const hangul = finalConsonant(last);
  if (hangul !== null) return hangul;

  if (/[0-9]/.test(last)) return TAIL_BY_DIGIT[Number(last)];
  const alpha = last.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(TAIL_BY_ALPHABET, alpha)) return TAIL_BY_ALPHABET[alpha];

  return null;
};

// [받침 있을 때, 받침 없을 때]
const JOSA_PAIRS = {
  '을': ['을', '를'], '를': ['을', '를'],
  '이': ['이', '가'], '가': ['이', '가'],
  '은': ['은', '는'], '는': ['은', '는'],
  '과': ['과', '와'], '와': ['과', '와'],
  '으로': ['으로', '로'], '로': ['으로', '로'],
  '아': ['아', '야'], '야': ['아', '야'],
  '이라': ['이라', '라'], '라': ['이라', '라'],
  '이었': ['이었', '였'], '였': ['이었', '였'],
  '이나': ['이나', '나'], '나': ['이나', '나'],
  '이며': ['이며', '며'], '며': ['이며', '며']
};

/**
 * 단어 뒤에 알맞은 조사를 붙여 반환
 * @param {string} word - 앞말
 * @param {string} josaType - 조사 (예: '을', '는', '으로')
 * @returns {string} 조사가 결합된 문자열 (예: '사과를')
 */
const josa = (word, josaType) => {
  const text = toStr(word);
  const pair = JOSA_PAIRS[josaType];
  if (!text || !pair) return text + toStr(josaType);

  const tail = tailOf(text);
  if (tail === null) return text + pair[1];

  // '으로/로'는 ㄹ 받침일 때 '로'를 쓴다 (예: 서울로)
  if ((josaType === '으로' || josaType === '로') && tail === 8) return text + '로';

  return text + (tail === 0 ? pair[1] : pair[0]);
};

const pad = {
  /**
   * 전화번호를 하이픈으로 구분된 형식으로 변환
   * @param {string|number} phone - 전화번호 (숫자만)
   * @param {{international?: boolean}} [options] - international: true면 +82 국제 형식
   * @returns {string} 포맷된 전화번호
   */
  phone: (phone, options = {}) => {
    const cleaned = digits(phone);
    if (!cleaned) return '';

    // 앞에 0이 빠진 경우 추가 (예: 1012345678 -> 01012345678)
    const normalized = cleaned.length === 10 && !cleaned.startsWith('0')
      ? '0' + cleaned
      : cleaned;

    let formatted = normalized;

    // 0507-xxxx-xxxx 평생번호 (12자리, 050으로 시작)
    if (normalized.length === 12 && normalized.startsWith('050')) {
      formatted = normalized.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 010/070-xxxx-xxxx (11자리)
    else if (normalized.length === 11) {
      formatted = normalized.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 02-xxx-xxxx 또는 02-xxxx-xxxx (9-10자리, 02로 시작)
    else if (normalized.length === 9 && normalized.startsWith('02')) {
      formatted = normalized.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    else if (normalized.length === 10 && normalized.startsWith('02')) {
      formatted = normalized.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 0xx-xxx-xxxx (10자리)
    else if (normalized.length === 10) {
      formatted = normalized.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    // 대표번호 15xx/16xx/18xx-xxxx (8자리, 1로 시작)
    else if (normalized.length === 8 && normalized.startsWith('1')) {
      formatted = normalized.replace(/(\d{4})(\d{4})/, '$1-$2');
    }

    if (!options.international) return formatted;

    // 대표번호는 국가번호를 붙여도 앞 0이 없으므로 그대로 둔다
    const withoutLeadingZero = formatted.startsWith('0') ? formatted.slice(1) : formatted;
    return `+82-${withoutLeadingZero}`;
  },

  /**
   * 사업자등록번호를 하이픈으로 구분된 형식으로 변환
   * @param {string|number} business - 사업자등록번호 (숫자만)
   * @returns {string} 포맷된 사업자등록번호
   */
  business: (business) => {
    const cleaned = digits(business);
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
    }
    return cleaned;
  },

  /**
   * 법인등록번호를 하이픈으로 구분된 형식으로 변환
   * @param {string|number} corp - 법인등록번호 (13자리)
   * @returns {string} 포맷된 법인등록번호 (예: 110111-1234567)
   */
  corp: (corp) => {
    const cleaned = digits(corp);
    if (cleaned.length === 13) {
      return cleaned.replace(/(\d{6})(\d{7})/, '$1-$2');
    }
    return cleaned;
  },

  /**
   * 카드번호를 4자리씩 하이픈으로 구분된 형식으로 변환
   * @param {string|number} card - 카드번호 (숫자만)
   * @returns {string} 포맷된 카드번호
   */
  card: (card) => {
    const cleaned = digits(card);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1-');
  },

  /**
   * 계좌번호를 은행 표기에 맞춰 하이픈으로 구분
   * 은행마다 자릿수 규칙이 달라, 지정한 그룹 규칙이 없으면 4자리씩 끊는다
   * @param {string|number} account - 계좌번호
   * @param {number[]} [groups] - 자릿수 그룹 (예: [3, 2, 6])
   * @returns {string} 포맷된 계좌번호
   */
  account: (account, groups) => {
    const cleaned = digits(account);
    if (!cleaned) return '';

    if (!Array.isArray(groups) || groups.length === 0) {
      return cleaned.replace(/(\d{4})(?=\d)/g, '$1-');
    }

    const parts = [];
    let cursor = 0;
    for (const size of groups) {
      if (cursor >= cleaned.length) break;
      parts.push(cleaned.substring(cursor, cursor + size));
      cursor += size;
    }
    if (cursor < cleaned.length) parts.push(cleaned.substring(cursor));

    return parts.join('-');
  }
};

const mask = {
  /**
   * 주민등록번호를 마스킹 처리 (한국 표준: 생년월일 + 성별자리만 노출)
   * @param {string} rrn - 주민등록번호
   * @returns {string} 마스킹된 주민등록번호 (예: 900101-1******)
   */
  rrn: (rrn) => {
    const cleaned = digits(rrn);
    if (cleaned.length === 13) {
      const front = cleaned.substring(0, 6);
      const gender = cleaned.substring(6, 7);
      return `${front}-${gender}******`;
    }
    return toStr(rrn);
  },

  /**
   * 전화번호를 마스킹 처리 (가운데 자리 앞쪽부터 maskLength 자리)
   * @param {string|number} phone - 전화번호
   * @param {number} maskLength - 마스킹할 자릿수 (기본: 4)
   * @returns {string} 마스킹된 전화번호 (예: 010-****-5678)
   */
  phone: (phone, maskLength = 4) => {
    const formatted = pad.phone(phone);
    const parts = formatted.split('-');
    if (parts.length === 3) {
      const mid = parts[1];
      const n = Math.max(0, Math.min(maskLength, mid.length));
      parts[1] = '*'.repeat(n) + mid.slice(n);
      return parts.join('-');
    }
    return formatted;
  },

  /**
   * 이메일을 마스킹 처리
   * @param {string} email - 이메일 주소
   * @returns {string} 마스킹된 이메일
   */
  email: (email) => {
    const text = toStr(email);
    const parts = text.split('@');
    if (parts.length === 2 && parts[0].length > 0) {
      const id = parts[0];
      const visibleLength = Math.max(1, Math.min(3, Math.ceil(id.length / 2)));
      const masked = id.substring(0, visibleLength) + '*'.repeat(Math.max(1, id.length - visibleLength));
      return `${masked}@${parts[1]}`;
    }
    return text;
  },

  /**
   * 이름을 마스킹 처리 (가운데 글자만 가림, 두 글자면 마지막 글자)
   * @param {string} name - 이름
   * @returns {string} 마스킹된 이름 (예: 홍*동, 김*)
   */
  name: (name) => {
    const text = toStr(name).trim();
    if (text.length <= 1) return text;
    if (text.length === 2) return text[0] + '*';
    return text[0] + '*'.repeat(text.length - 2) + text[text.length - 1];
  },

  /**
   * 카드번호를 마스킹 처리 (앞 6자리 · 뒤 4자리만 노출)
   * @param {string|number} card - 카드번호
   * @returns {string} 마스킹된 카드번호 (예: 1234-56**-****-3456)
   */
  card: (card) => {
    const cleaned = digits(card);
    if (cleaned.length < 11) return pad.card(cleaned);

    const masked = cleaned.substring(0, 6)
      + '*'.repeat(cleaned.length - 10)
      + cleaned.substring(cleaned.length - 4);

    return masked.replace(/(.{4})(?=.)/g, '$1-');
  },

  /**
   * 사업자등록번호를 마스킹 처리 (뒤 4자리를 가림)
   * @param {string|number} business - 사업자등록번호
   * @returns {string} 마스킹된 사업자등록번호 (예: 123-45-6****)
   */
  business: (business) => {
    const cleaned = digits(business);
    if (cleaned.length !== 10) return toStr(business);
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 5)}-${cleaned[5]}****`;
  },

  /**
   * 계좌번호를 마스킹 처리 (뒤 4자리만 노출)
   * @param {string|number} account - 계좌번호
   * @returns {string} 마스킹된 계좌번호 (예: ******-**-1234)
   */
  account: (account) => {
    const text = toStr(account);
    const cleaned = digits(text);
    if (cleaned.length < 5) return text;

    const visible = cleaned.substring(cleaned.length - 4);
    const maskedDigits = '*'.repeat(cleaned.length - 4) + visible;

    // 원본에 하이픈이 있으면 그 위치를 유지한다
    if (text.includes('-')) {
      let cursor = 0;
      return text.replace(/\d/g, () => maskedDigits[cursor++]);
    }
    return maskedDigits;
  }
};

const format = {
  /**
   * 숫자를 한국 통화 형식으로 변환
   * @param {number|string} amount - 금액
   * @param {boolean} withUnit - '원' 단위 포함 여부 (기본: true)
   * @returns {string} 포맷된 금액
   */
  currency: (amount, withUnit = true) => {
    const num = Number(toStr(amount).replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return amount;

    const formatted = num.toLocaleString('ko-KR');
    return withUnit ? `${formatted}원` : formatted;
  },

  /**
   * 금액을 조·억·만 단위의 한국식 표기로 변환
   * @param {number|string} amount - 금액
   * @param {boolean} withUnit - '원' 단위 포함 여부 (기본: true)
   * @returns {string} 포맷된 금액 (예: 1억 2,345만원)
   */
  koreanCurrency: (amount, withUnit = true) => {
    const num = Number(toStr(amount).replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return amount;

    const truncated = Math.trunc(num);
    if (truncated === 0) return withUnit ? '0원' : '0';

    const sign = truncated < 0 ? '-' : '';
    let rest = Math.abs(truncated);
    const units = [[1e12, '조'], [1e8, '억'], [1e4, '만']];
    const parts = [];

    for (const [value, label] of units) {
      const quotient = Math.floor(rest / value);
      if (quotient > 0) {
        parts.push(`${quotient.toLocaleString('ko-KR')}${label}`);
        rest -= quotient * value;
      }
    }
    if (rest > 0) parts.push(rest.toLocaleString('ko-KR'));

    return `${sign}${parts.join(' ')}${withUnit ? '원' : ''}`;
  },

  /**
   * 숫자를 천 단위로 쉼표 구분
   * @param {number|string} number - 숫자
   * @returns {string} 포맷된 숫자
   */
  number: (number) => {
    const num = Number(toStr(number).replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return number;
    return num.toLocaleString('ko-KR');
  },

  /**
   * 날짜를 한국 형식으로 변환
   * @param {Date|string|number} date - 날짜
   * @param {string} separator - 구분자 (기본: '.')
   * @returns {string} 포맷된 날짜
   */
  date: (date, separator = '.') => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}${separator}${month}${separator}${day}`;
  },

  /**
   * 날짜를 '2024년 1월 15일' 형식으로 변환
   * @param {Date|string|number} date - 날짜
   * @param {boolean} withWeekday - 요일 포함 여부 (기본: false)
   * @returns {string} 포맷된 날짜
   */
  dateKo: (date, withWeekday = false) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;

    const base = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    if (!withWeekday) return base;

    const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    return `${base} ${weekday}요일`;
  },

  /**
   * 시각을 24시간제로 변환
   * @param {Date|string|number} date - 날짜
   * @param {boolean} withSeconds - 초 포함 여부 (기본: false)
   * @returns {string} 포맷된 시각 (예: 14:05)
   */
  time: (date, withSeconds = false) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;

    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (!withSeconds) return `${hh}:${mm}`;

    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  },

  /**
   * 기준 시각 대비 상대 시간을 한국어로 변환
   * @param {Date|string|number} date - 대상 시각
   * @param {Date|string|number} [baseDate] - 기준 시각 (기본: 현재)
   * @returns {string} 상대 시간 (예: 3분 전, 2일 후)
   */
  relativeTime: (date, baseDate = new Date()) => {
    const target = new Date(date);
    const base = new Date(baseDate);
    if (isNaN(target.getTime()) || isNaN(base.getTime())) return date;

    const diffMs = base.getTime() - target.getTime();
    const suffix = diffMs >= 0 ? '전' : '후';
    const seconds = Math.floor(Math.abs(diffMs) / 1000);

    if (seconds < 60) return '방금 전';

    const steps = [
      [60, '분'],
      [3600, '시간'],
      [86400, '일'],
      [2592000, '개월'], // 30일
      [31536000, '년']
    ];

    for (let i = steps.length - 1; i >= 0; i--) {
      const [unitSeconds, label] = steps[i];
      if (seconds >= unitSeconds) {
        return `${Math.floor(seconds / unitSeconds)}${label} ${suffix}`;
      }
    }

    return '방금 전';
  },

  /**
   * 파일 크기를 읽기 쉬운 형식으로 변환
   * @param {number|string} bytes - 바이트 크기
   * @returns {string} 포맷된 파일 크기
   */
  fileSize: (bytes) => {
    const num = Number(bytes);
    if (isNaN(num)) return bytes;

    const sign = num < 0 ? '-' : '';
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let size = Math.abs(num);
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${sign}${size.toFixed(unitIndex === 0 ? 0 : 1)}${units[unitIndex]}`;
  },

  /**
   * 단어 뒤에 알맞은 조사를 붙여 반환
   * @param {string} word - 앞말
   * @param {string} josaType - 조사 (예: '을', '는', '으로')
   * @returns {string} 조사가 결합된 문자열
   */
  josa: josa
};

const validate = {
  /**
   * 전화번호 형식 검증
   * @param {string|number} phone - 전화번호
   * @returns {boolean} 유효 여부
   */
  phone: (phone) => {
    const cleaned = digits(phone);
    if (!cleaned) return false;

    // 대표번호 15xx/16xx/18xx (8자리)
    if (/^1[5-9]\d{6}$/.test(cleaned)) return true;
    // 평생번호 050x (12자리)
    if (/^050\d{9}$/.test(cleaned)) return true;
    // 휴대폰 01x (10-11자리)
    if (/^01[016789]\d{7,8}$/.test(cleaned)) return true;
    // 인터넷 전화 070 (11자리)
    if (/^070\d{8}$/.test(cleaned)) return true;
    // 서울 02 (9-10자리)
    if (/^02\d{7,8}$/.test(cleaned)) return true;
    // 그 외 지역번호 (10-11자리)
    if (/^0(3[1-3]|4[1-4]|5[1-5]|6[1-4])\d{7,8}$/.test(cleaned)) return true;

    return false;
  },

  /**
   * 사업자등록번호 검증 (국세청 체크섬)
   * @param {string|number} business - 사업자등록번호
   * @returns {boolean} 유효 여부
   */
  business: (business) => {
    const cleaned = digits(business);
    if (cleaned.length !== 10) return false;

    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += Number(cleaned[i]) * weights[i];
    }
    // 9번째 자리에 5를 곱한 값의 십의 자리를 한 번 더 더한다
    sum += Math.floor((Number(cleaned[8]) * 5) / 10);

    return (10 - (sum % 10)) % 10 === Number(cleaned[9]);
  },

  /**
   * 주민등록번호 검증
   * 생년월일 · 성별코드 형식을 확인한다. checksum 옵션은 2020년 10월 이전
   * 발급분에만 유효하다 (이후 발급분은 뒤 6자리가 임의번호라 검증식이 성립하지 않음)
   * @param {string} rrn - 주민등록번호
   * @param {{checksum?: boolean}} [options] - checksum: true면 검증번호까지 확인 (기본: false)
   * @returns {boolean} 유효 여부
   */
  rrn: (rrn, options = {}) => {
    const cleaned = digits(rrn);
    if (cleaned.length !== 13) return false;

    const year = Number(cleaned.substring(0, 2));
    const month = Number(cleaned.substring(2, 4));
    const day = Number(cleaned.substring(4, 6));
    const genderCode = Number(cleaned[6]);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (genderCode < 1 || genderCode > 8) return false;

    // 성별코드로 세기를 판별해 실제 존재하는 날짜인지 확인 (1·2·5·6 = 1900년대)
    const century = genderCode <= 2 || genderCode === 5 || genderCode === 6 ? 1900 : 2000;
    const fullYear = century + year;
    const d = new Date(fullYear, month - 1, day);
    if (d.getFullYear() !== fullYear || d.getMonth() !== month - 1 || d.getDate() !== day) return false;

    if (!options.checksum) return true;

    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += Number(cleaned[i]) * weights[i];
    }
    return (11 - (sum % 11)) % 10 === Number(cleaned[12]);
  },

  /**
   * 카드번호 검증 (Luhn 알고리즘)
   * @param {string|number} card - 카드번호
   * @returns {boolean} 유효 여부
   */
  card: (card) => {
    const cleaned = digits(card);
    if (cleaned.length < 12 || cleaned.length > 19) return false;

    let sum = 0;
    let double = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let n = Number(cleaned[i]);
      if (double) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      double = !double;
    }
    return sum % 10 === 0;
  },

  /**
   * 이메일 형식 검증
   * @param {string} email - 이메일 주소
   * @returns {boolean} 유효 여부
   */
  email: (email) => {
    const text = toStr(email).trim();
    if (!text || text.length > 254) return false;
    return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(text);
  },

  /**
   * 우편번호 검증 (5자리 신 우편번호)
   * @param {string|number} zipCode - 우편번호
   * @returns {boolean} 유효 여부
   */
  zipCode: (zipCode) => /^\d{5}$/.test(digits(zipCode))
};

module.exports = { pad, mask, format, validate, josa };
