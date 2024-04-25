import Storage from "@/utils/storage";
import { TOKEN_KEY, OA_TOKEN_KEYS } from "@/utils/enums"

// oa 中单点登录使用 token 可能存在两个 key 值，需要循环使用两个 key 获取 cookies 中的 token
// 旧 OA 使用 SIAMJWT, 新 OA 使用 SIAMTGT 和 LtpaToken
// OA 系统中会使用'SIAMTGT', 'SIAMJWT' 换取该 token 进行登录, 在内嵌 oa 页面中必须使用 LtpaToken  进行跳转登录 oa

interface tokenInfoType {
  token: string | null | undefined,
  expire?: number | string | null,
  key?: string | null,
  ticketName: string,
  ticketValue: string
}
/**
 * 设置 Token 信息
 * @param {*} param
 */
export function setTokenInfo({ token, expire, key, ticketName, ticketValue }: tokenInfoType, domain: string): viod {
  Storage.setCookies(TOKEN_KEY, token)
  return setOAToken(ticketName, ticketValue, domain)
}

/**
 * 移除 Token 信息
 */
export function removeAuthToken(domain: string) {
  removeToken(domain)
  removeOAToken(domain)
}

/**
 * 获取 Token
 * @param {*} key
 * @returns
 */
export function getToken(key?: string | undefined): string {
  const setKey = key || TOKEN_KEY
  return Storage.getCookies(setKey) as string
}

/**
 * 设置 Token
 * @param {*} token
 * @returns
 */
export function setToken(token: string | null | undefined) {
  return Storage.setCookies(TOKEN_KEY, token)
}

/**
 * 移除 Token
 * @returns
 */
export function removeToken(domain: string) {
  removeOAToken(domain)
  return Storage.removeCookies(TOKEN_KEY)
}

interface oaTokensType {
  key: string | null,
  oaToken: string | null | undefined,
}
/**
 * 获取 Token, 由于 OA 使用三个 token，因此需要遍历获取 token
 * @returns
 */
export function getOAToken(domain: string): oaTokensType {
  let key = null
  let oaToken = null

  for (const keys of OA_TOKEN_KEYS) {
    oaToken = Storage.getCookies(keys, {
      domain: domain
    })
    if (oaToken) {
      key = keys
      break
    }
  }

  return {
    key,
    oaToken
  }
}

/**
 * 设置 OA token
 * @param {*} TOKEN_KEY
 * @param {*} token
 * @returns
 */
export function setOAToken(tokenKey: string, token: string, domain: string) {
  return Storage.setCookies(tokenKey, token, {
    expires: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    domain: domain
  })
}

/**
 * 清空所有 oa token
 */
export function removeOAToken(domain: string) {
  OA_TOKEN_KEYS.forEach((key: string) =>
    Storage.removeCookies(key, {
      domain: domain
    })
  )
}

