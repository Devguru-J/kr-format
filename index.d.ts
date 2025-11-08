/**
 * kr-format - 한국 개발자를 위한 필수 포맷팅 유틸리티
 */

export interface Pad {
  /**
   * 전화번호를 하이픈으로 구분된 형식으로 변환
   * @param phone - 전화번호 (숫자만)
   * @returns 포맷된 전화번호 (예: 010-1234-5678)
   */
  phone(phone: string | number): string;

  /**
   * 사업자등록번호를 하이픈으로 구분된 형식으로 변환
   * @param business - 사업자등록번호 (숫자만)
   * @returns 포맷된 사업자등록번호 (예: 123-45-67890)
   */
  business(business: string | number): string;

  /**
   * 카드번호를 4자리씩 하이픈으로 구분된 형식으로 변환
   * @param card - 카드번호 (숫자만)
   * @returns 포맷된 카드번호 (예: 1234-5678-9012-3456)
   */
  card(card: string | number): string;
}

export interface Mask {
  /**
   * 주민등록번호를 마스킹 처리
   * @param rrn - 주민등록번호
   * @param visibleDigits - 뒷자리에서 보여줄 숫자 개수 (기본: 0)
   * @returns 마스킹된 주민등록번호 (예: 900101-*******)
   */
  rrn(rrn: string, visibleDigits?: number): string;

  /**
   * 전화번호를 마스킹 처리
   * @param phone - 전화번호
   * @param maskLength - 마스킹할 자릿수 (기본: 4)
   * @returns 마스킹된 전화번호 (예: 010-****-5678)
   */
  phone(phone: string | number, maskLength?: number): string;

  /**
   * 이메일을 마스킹 처리
   * @param email - 이메일 주소
   * @returns 마스킹된 이메일 (예: abc***@example.com)
   */
  email(email: string): string;
}

export interface Format {
  /**
   * 숫자를 한국 통화 형식으로 변환
   * @param amount - 금액
   * @param withUnit - '원' 단위 포함 여부 (기본: true)
   * @returns 포맷된 금액 (예: 1,234,567원)
   */
  currency(amount: number | string, withUnit?: boolean): string;

  /**
   * 숫자를 천 단위로 쉼표 구분
   * @param number - 숫자
   * @returns 포맷된 숫자 (예: 1,234,567)
   */
  number(number: number | string): string;

  /**
   * 날짜를 한국 형식으로 변환
   * @param date - 날짜
   * @param separator - 구분자 (기본: '.')
   * @returns 포맷된 날짜 (예: 2024.01.01)
   */
  date(date: Date | string, separator?: string): string;

  /**
   * 파일 크기를 읽기 쉬운 형식으로 변환
   * @param bytes - 바이트 크기
   * @returns 포맷된 파일 크기 (예: 1.5MB)
   */
  fileSize(bytes: number): string;
}

export const pad: Pad;
export const mask: Mask;
export const format: Format;
