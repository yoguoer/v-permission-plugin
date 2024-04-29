import Storage from "@/utils/storage";
import { defineStore } from "pinia";
import { store } from "@/store";
import { getToken, setToken, removeToken, getOAToken } from "@/utils/token";
import storageOptions from "@/utils/setStorage";

export interface authorityType {
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
        const { type } = storageOptions
        const storage = new Storage(type);
        storage.setItem(oa.ticketName, oa.ticketValue);
      }
    },

    SetAuthority(authority: authorityType) {
      this.authority = authority
    },

    // 获取用户权限列表
    async GetAuthority(getAuthList: Function, domain: string): Promise<T> {
      try {
        if(typeof getAuthList !== "function") {
          return Error("getAuthList 参数错误")
        }
        const authority: authorityType =  {
          menuNames:[], // 菜单权限名称列表
          rule: [],// 按钮级别权限
        }
        const data = await getAuthList()
        authority.menuNames = data.menuNames
        authority.rule = data.rule
        this.SetAuthority(authority);
        return authority
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
        if(typeof checkOaLogin !== "function") {
          return Error("checkOaLogin 参数错误")
        }
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
      Storage.clearAll();
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store)
}
