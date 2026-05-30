/**
 * kr-format - 한국 개발자를 위한 필수 포맷팅 유틸리티
 */

const pad = {
  /**
   * 전화번호를 하이픈으로 구분된 형식으로 변환
   * @param {string|number} phone - 전화번호 (숫자만)
   * @returns {string} 포맷된 전화번호
   */
  phone: (phone) => {
    const cleaned = String(phone).replace(/\D/g, '');

    // 앞에 0이 빠진 경우 추가 (예: 1012345678 -> 01012345678)
    const normalized = cleaned.length === 10 && !cleaned.startsWith('0')
      ? '0' + cleaned
      : cleaned;

    // 0507-xxxx-xxxx 평생번호 (12자리, 050으로 시작)
    if (normalized.length === 12 && normalized.startsWith('050')) {
      return normalized.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 010/070-xxxx-xxxx (11자리)
    if (normalized.length === 11) {
      return normalized.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 02-xxx-xxxx 또는 02-xxxx-xxxx (9-10자리, 02로 시작)
    if (normalized.length === 9 && normalized.startsWith('02')) {
      return normalized.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    if (normalized.length === 10 && normalized.startsWith('02')) {
      return normalized.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 0xx-xxx-xxxx 또는 0xx-xxxx-xxxx (10-11자리)
    if (normalized.length === 10) {
      return normalized.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    // 대표번호 15xx/16xx/18xx-xxxx (8자리, 1로 시작)
    if (normalized.length === 8 && normalized.startsWith('1')) {
      return normalized.replace(/(\d{4})(\d{4})/, '$1-$2');
    }

    return normalized;
  },

  /**
   * 사업자등록번호를 하이픈으로 구분된 형식으로 변환
   * @param {string|number} business - 사업자등록번호 (숫자만)
   * @returns {string} 포맷된 사업자등록번호
   */
  business: (business) => {
    const cleaned = String(business).replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
    }
    return cleaned;
  },

  /**
   * 카드번호를 4자리씩 하이픈으로 구분된 형식으로 변환
   * @param {string|number} card - 카드번호 (숫자만)
   * @returns {string} 포맷된 카드번호
   */
  card: (card) => {
    const cleaned = String(card).replace(/\D/g, '');
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1-');
  }
};

const mask = {
  /**
   * 주민등록번호를 마스킹 처리 (한국 표준: 생년월일 + 성별자리만 노출)
   * @param {string} rrn - 주민등록번호
   * @returns {string} 마스킹된 주민등록번호 (예: 900101-1******)
   */
  rrn: (rrn) => {
    const cleaned = String(rrn).replace(/\D/g, '');
    if (cleaned.length === 13) {
      const front = cleaned.substring(0, 6);
      const gender = cleaned.substring(6, 7);
      return `${front}-${gender}******`;
    }
    return rrn;
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
      const n = Math.min(maskLength, mid.length);
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
    const parts = email.split('@');
    if (parts.length === 2) {
      const id = parts[0];
      const visibleLength = Math.max(1, Math.min(3, Math.ceil(id.length / 2)));
      const masked = id.substring(0, visibleLength) + '*'.repeat(Math.max(1, id.length - visibleLength));
      return `${masked}@${parts[1]}`;
    }
    return email;
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
    const num = Number(String(amount).replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return amount;

    const formatted = num.toLocaleString('ko-KR');
    return withUnit ? `${formatted}원` : formatted;
  },

  /**
   * 숫자를 천 단위로 쉼표 구분
   * @param {number|string} number - 숫자
   * @returns {string} 포맷된 숫자
   */
  number: (number) => {
    const num = Number(String(number).replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return number;
    return num.toLocaleString('ko-KR');
  },

  /**
   * 날짜를 한국 형식으로 변환
   * @param {Date|string} date - 날짜
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
   * 파일 크기를 읽기 쉬운 형식으로 변환
   * @param {number} bytes - 바이트 크기
   * @returns {string} 포맷된 파일 크기
   */
  fileSize: (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)}${units[unitIndex]}`;
  }
};

module.exports = { pad, mask, format };
