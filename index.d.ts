/**
 * kr-format - 한국 개발자를 위한 필수 포맷팅 유틸리티
 */

/** 결합 가능한 조사 (앞말 받침에 따라 자동 선택) */
export type JosaType =
  | '을' | '를'
  | '이' | '가'
  | '은' | '는'
  | '과' | '와'
  | '으로' | '로'
  | '아' | '야'
  | '이라' | '라'
  | '이었' | '였'
  | '이나' | '나'
  | '이며' | '며';

export interface PhoneFormatOptions {
  /** true면 +82 국제 형식으로 반환 (예: +82-10-1234-5678) */
  international?: boolean;
}

export interface RrnValidateOptions {
  /**
   * true면 검증번호(체크섬)까지 확인한다.
   * 2020년 10월 이후 발급된 주민등록번호는 뒤 6자리가 임의번호라
   * 이 검증식이 성립하지 않으므로 기본값은 false다.
   */
  checksum?: boolean;
}

export interface Pad {
  /**
   * 전화번호를 하이픈으로 구분된 형식으로 변환
   * @param phone - 전화번호 (숫자만)
   * @param options - international: true면 +82 국제 형식
   * @returns 포맷된 전화번호 (예: 010-1234-5678, 0507-1234-5678, 1588-1234)
   */
  phone(phone: string | number | null | undefined, options?: PhoneFormatOptions): string;

  /**
   * 사업자등록번호를 하이픈으로 구분된 형식으로 변환
   * @param business - 사업자등록번호 (숫자만)
   * @returns 포맷된 사업자등록번호 (예: 123-45-67890)
   */
  business(business: string | number | null | undefined): string;

  /**
   * 법인등록번호를 하이픈으로 구분된 형식으로 변환
   * @param corp - 법인등록번호 (13자리)
   * @returns 포맷된 법인등록번호 (예: 110111-1234567)
   */
  corp(corp: string | number | null | undefined): string;

  /**
   * 카드번호를 4자리씩 하이픈으로 구분된 형식으로 변환
   * @param card - 카드번호 (숫자만)
   * @returns 포맷된 카드번호 (예: 1234-5678-9012-3456)
   */
  card(card: string | number | null | undefined): string;

  /**
   * 계좌번호를 하이픈으로 구분 (그룹 미지정 시 4자리씩)
   * @param account - 계좌번호
   * @param groups - 자릿수 그룹 (예: [6, 2, 6])
   * @returns 포맷된 계좌번호 (예: 123456-78-901234)
   */
  account(account: string | number | null | undefined, groups?: number[]): string;
}

export interface Mask {
  /**
   * 주민등록번호를 마스킹 처리 (한국 표준: 생년월일 + 성별자리만 노출)
   * @param rrn - 주민등록번호
   * @returns 마스킹된 주민등록번호 (예: 900101-1******)
   */
  rrn(rrn: string | number | null | undefined): string;

  /**
   * 전화번호를 마스킹 처리 (가운데 자리 앞쪽부터 maskLength 자리)
   * @param phone - 전화번호
   * @param maskLength - 마스킹할 자릿수 (기본: 4)
   * @returns 마스킹된 전화번호 (예: 010-****-5678)
   */
  phone(phone: string | number | null | undefined, maskLength?: number): string;

  /**
   * 이메일을 마스킹 처리
   * @param email - 이메일 주소
   * @returns 마스킹된 이메일 (예: te**@example.com)
   */
  email(email: string | null | undefined): string;

  /**
   * 이름을 마스킹 처리 (가운데 글자를 가림)
   * @param name - 이름
   * @returns 마스킹된 이름 (예: 홍*동, 김*)
   */
  name(name: string | null | undefined): string;

  /**
   * 카드번호를 마스킹 처리 (앞 6자리 · 뒤 4자리만 노출)
   * @param card - 카드번호
   * @returns 마스킹된 카드번호 (예: 1234-56**-****-3456)
   */
  card(card: string | number | null | undefined): string;

  /**
   * 사업자등록번호를 마스킹 처리 (뒤 4자리를 가림)
   * @param business - 사업자등록번호
   * @returns 마스킹된 사업자등록번호 (예: 123-45-6****)
   */
  business(business: string | number | null | undefined): string;

  /**
   * 계좌번호를 마스킹 처리 (뒤 4자리만 노출, 하이픈 위치 유지)
   * @param account - 계좌번호
   * @returns 마스킹된 계좌번호 (예: ******-**-**1234)
   */
  account(account: string | number | null | undefined): string;
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
   * 금액을 조·억·만 단위의 한국식 표기로 변환
   * @param amount - 금액
   * @param withUnit - '원' 단위 포함 여부 (기본: true)
   * @returns 포맷된 금액 (예: 1억 2,345만원)
   */
  koreanCurrency(amount: number | string, withUnit?: boolean): string;

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
   * @returns 포맷된 날짜 (예: 2024.01.15)
   */
  date(date: Date | string | number, separator?: string): string;

  /**
   * 날짜를 '2024년 1월 15일' 형식으로 변환
   * @param date - 날짜
   * @param withWeekday - 요일 포함 여부 (기본: false)
   * @returns 포맷된 날짜 (예: 2024년 1월 15일 월요일)
   */
  dateKo(date: Date | string | number, withWeekday?: boolean): string;

  /**
   * 시각을 24시간제로 변환
   * @param date - 날짜
   * @param withSeconds - 초 포함 여부 (기본: false)
   * @returns 포맷된 시각 (예: 14:05)
   */
  time(date: Date | string | number, withSeconds?: boolean): string;

  /**
   * 기준 시각 대비 상대 시간을 한국어로 변환
   * @param date - 대상 시각
   * @param baseDate - 기준 시각 (기본: 현재)
   * @returns 상대 시간 (예: 3분 전, 2일 후)
   */
  relativeTime(date: Date | string | number, baseDate?: Date | string | number): string;

  /**
   * 파일 크기를 읽기 쉬운 형식으로 변환
   * @param bytes - 바이트 크기
   * @returns 포맷된 파일 크기 (예: 1.5MB)
   */
  fileSize(bytes: number | string): string;

  /**
   * 단어 뒤에 알맞은 조사를 붙여 반환
   * @param word - 앞말
   * @param josaType - 조사
   * @returns 조사가 결합된 문자열 (예: 사과를)
   */
  josa(word: string | number, josaType: JosaType): string;
}

export interface Validate {
  /**
   * 전화번호 형식 검증
   * @param phone - 전화번호
   */
  phone(phone: string | number | null | undefined): boolean;

  /**
   * 사업자등록번호 검증 (국세청 체크섬)
   * @param business - 사업자등록번호
   */
  business(business: string | number | null | undefined): boolean;

  /**
   * 주민등록번호 검증 (생년월일 · 성별코드, 옵션으로 체크섬)
   * @param rrn - 주민등록번호
   * @param options - checksum: true면 검증번호까지 확인 (기본: false)
   */
  rrn(rrn: string | number | null | undefined, options?: RrnValidateOptions): boolean;

  /**
   * 카드번호 검증 (Luhn 알고리즘)
   * @param card - 카드번호
   */
  card(card: string | number | null | undefined): boolean;

  /**
   * 이메일 형식 검증
   * @param email - 이메일 주소
   */
  email(email: string | null | undefined): boolean;

  /**
   * 우편번호 검증 (5자리 신 우편번호)
   * @param zipCode - 우편번호
   */
  zipCode(zipCode: string | number | null | undefined): boolean;
}

/**
 * 단어 뒤에 알맞은 조사를 붙여 반환
 * @param word - 앞말
 * @param josaType - 조사
 * @returns 조사가 결합된 문자열 (예: 사과를, 서울로)
 */
export function josa(word: string | number, josaType: JosaType): string;

export const pad: Pad;
export const mask: Mask;
export const format: Format;
export const validate: Validate;
