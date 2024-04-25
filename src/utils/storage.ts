import Cookies from 'js-cookie'

export default class Storage {

  /**
   * 获取 Cookies
   * @param key 
   * @returns 
   */
  static getCookies<T>(key: string, params?: object | null): T | null {
    const value = Cookies.get(key, params);
    if (value === undefined) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  /**
   * 设置 Cookies
   * @param key 
   * @param value 
   * @param options 
   */
  static setCookies(key: string, value: any, options?: Cookies.CookieAttributes): void {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    return Cookies.set(key, value, options);
  }

  /**
   * 移除 Cookies
   * @param key 
   * @param options 
   */
  static removeCookies(key: string, options?: Cookies.CookieAttributes): void {
    Cookies.remove(key, options);
  }


  /**
   * 清除 Cookies
   * @param key 
   * @param options 
   */
  static clearCookies(): void {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }



  /**
 * * 存储本地会话数据
 * @param k 键名
 * @param v 键值（无需stringiiy）
 * @returns RemovableRef
 */
  static setLocalStorage<T>(k: string, v: T) {
    try {
      window.localStorage.setItem(k, JSON.stringify(v))
    } catch (error) {
      return false
    }
  }


  /**
   * * 获取本地会话数据
   * @param k 键名
   * @returns any
   */
  static getLocalStorage(k: string) {
    const item = window.localStorage.getItem(k)
    try {
      return item ? JSON.parse(item) : item
    } catch (err) {
      return item
    }
  }



  /**
   * * 清空所有本地会话数据
   * @param k 键名
   * @returns any
   */
  static clearLocalStorage() {
    try {
      return window.localStorage.clear()
    } catch (err) {
      return false
    }
  }


  /**
   * * 存储临时会话数据
   * @param k 键名
   * @param v 键值
   * @returns RemovableRef
   */
  static setSessionStorage<T>(k: string, v: T) {
    try {
      window.sessionStorage.setItem(k, JSON.stringify(v))
    } catch (error) {
      return false
    }
  }

  /**
   * * 获取临时会话数据
   * @returns any
   */
  static getSessionStorage: (k: string) => any = (k: string) => {
    const item = window.sessionStorage.getItem(k)
    try {
      return item ? JSON.parse(item) : item
    } catch (err) {
      return item
    }
  }

  /**
   * * 清除本地会话数据
   * @param name
   */
  static clearSessioStorage(name?: string) {
    try {

      return name ? window.sessionStorage.removeItem(name) : window.sessionStorage.clear();
    } catch (err) {
      return false
    }
  }

}



