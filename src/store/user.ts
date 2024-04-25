import Storage from "@/utils/storage";
import { defineStore } from "pinia";
import { store } from "@/store";
import { getToken, setToken, removeToken, getOAToken } from "@/utils/token";
import { getChildValue } from "@/utils/index"

export interface authorityType {
  menu: Array<T>, // 菜单权限
  menuNames: Array<T>, // 菜单权限名称列表
  rule: Array<T>,// 按钮级别权限
}

export interface TokenType {
  token?: string | undefined | null,
  expire?: string | undefined | null,
  oa?: {
    ticketName?: string | undefined | null,
    ticketValue?: string | undefined | null,
  }
}

interface UserState {
  authority: authorityType,
  token?: string | undefined | null,
  expire?: string | undefined | null,
  oa?: {
    ticketName?: string | undefined | null,
    ticketValue?: string | undefined | null,
  }
}

export const useUserStore = defineStore({
  id: "user-store",

  state: ():
    UserState => ({
      authority: {
        menu: [], // 菜单权限
        menuNames: [],  // 菜单权限名称列表
        rule: [], // 按钮级别权限
      },
      // token
      token: undefined,
      expire: undefined,
      oa: {
        ticketName: null,
        ticketValue: null
      }
    }),

  getters: {
    getToken(): string {
      return getToken();
    },
    getAuthority(): authorityType {
      return this.authority || {};
    }
  },

  actions: {
    SetToken(data: TokenType) {
      const {
        oa = { ticketName: null, ticketValue: null },
        token = null
      } = data;
      this.token = token || ''; // for null or undefined value
      this.oa = oa;
      setToken(token);
      if (oa.ticketName) {
        Storage.setCookies(oa.ticketName, oa.ticketValue);
      }
    },

    SetAuthority(authority: authorityType) {
      this.authority = authority
    },

    // 获取用户权限列表
    async GetAuthority(getAuthList: Function, domain: string): Promise<T> {
      try {
        const data = await getAuthList()
        const leftMenuNames: Array<T> = []
        // 递归获取后端路由 name 的数组存入 leftMenuNames
        getChildValue(data?.menu || [], leftMenuNames, 'name', 'children')
        data.menuNames = leftMenuNames
        this.SetAuthority(data);
        return data
      } catch (error) {
        this.ClearLocal(domain);
        return null;
      }
    },

    // 使用 oa token 登录系统
    async CheckOaLogin(checkOaLogin: Function, domain: string) {
      const { key, oaToken } = getOAToken(domain);
      if (!oaToken) return false;
      try {
        const data = await checkOaLogin({
          ticketName: key,
          ticketValue: oaToken
        })
        return data;
      } catch (error) {
        this.Logout(domain);
      }
    },

    // 退出
    async Logout(domain: string) {
      try {
      } catch (error) {
        console.error(error);
      } finally {
        this.ClearLocal(domain);
        location.hash = '/login'
      }
    },

    //清空存储数据
    ClearLocal(domain: string) {
      removeToken(domain);
      Storage.clearLocalStorage();
      Storage.clearSessioStorage();
      Storage.clearCookies();
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store)
}
