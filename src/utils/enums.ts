/**
 * @description: 系统环境
 */
export enum envEnum {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

/**
 * @description: 登录信息枚举（使用枚举统一缓存key值,当修改key值时可统一修改）
 */
export enum LoginEnum {
  USERNAME = "username",
  PASSWORD = "password",
  REMEMBERME = "rememberMe",
}

// token key
export const TOKEN_KEY = 'PMP_TOKEN__';
// oa token key
export const OA_TOKEN_KEYS = ['SIAMTGT', 'SIAMJWT'];
export const LOCALE_KEY = 'PMP_LOCALE__';

// user info key
export const USER_INFO_KEY = 'PMP_USER__INFO__';


// user authority key
export const USER_AUTHORITY_KEY = 'PMP_USER__AUTHORITY__';


// user async route key
export const USER_ASYNC_ROUTE_KEY = 'PMP_USER_ASYNC_ROUTE_';


