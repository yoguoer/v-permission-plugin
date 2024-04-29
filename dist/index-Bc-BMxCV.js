"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const Cookies = require("js-cookie");
const index = require("./permission.js");
const pinia = require("pinia");
const index$1 = require("./index-DKjqm6ao.js");
class Storage {
  constructor(type) {
    this.getSessionStorage = (k) => {
      const item = window.sessionStorage.getItem(k);
      try {
        return item ? JSON.parse(item) : item;
      } catch (err) {
        return item;
      }
    };
    this.type = type;
  }
  //获取 Cookies
  getCookies(key, params) {
    const value = Cookies.get(key, params);
    if (value === void 0) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  //设置 Cookies
  setCookies(key, value, options) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    return Cookies.set(key, value, options);
  }
  //移除某个Cookies
  removeCookies(key, options) {
    Cookies.remove(key, options);
  }
  //清除 Cookies
  clearCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }
  //存储本地会话数据
  setLocalStorage(k, v) {
    try {
      window.localStorage.setItem(k, JSON.stringify(v));
    } catch (error) {
      return false;
    }
  }
  //获取本地会话数据
  getLocalStorage(k) {
    const item = window.localStorage.getItem(k);
    try {
      return item ? JSON.parse(item) : item;
    } catch (err) {
      return item;
    }
  }
  //移除某个本地会话数据
  removeLocalStorage(name) {
    try {
      return name ? window.localStorage.removeItem(name) : window.localStorage.clear();
    } catch (err) {
      return false;
    }
  }
  //清空所有本地会话数据
  clearLocalStorage() {
    try {
      return window.localStorage.clear();
    } catch (err) {
      return false;
    }
  }
  //存储临时会话数据
  setSessionStorage(k, v) {
    try {
      window.sessionStorage.setItem(k, JSON.stringify(v));
    } catch (error) {
      return false;
    }
  }
  //移除某个临时会话数据
  removeSessionStorage(name) {
    try {
      return name ? window.sessionStorage.removeItem(name) : window.sessionStorage.clear();
    } catch (err) {
      return false;
    }
  }
  //清空所有临时会话数据
  clearSessionStorage() {
    try {
      return window.sessionStorage.clear();
    } catch (err) {
      return false;
    }
  }
  setItem(key, value, options) {
    switch (this.type) {
      case "localStorage":
        this.setLocalStorage(key, value);
        break;
      case "sessionStorage":
        this.setSessionStorage(key, value);
        break;
      case "cookie":
        this.setCookies(key, value, options);
        break;
      default:
        throw new Error("Invalid storage type");
    }
  }
  getItem(key, params) {
    switch (this.type) {
      case "localStorage":
        return this.getLocalStorage(key);
      case "sessionStorage":
        return this.getSessionStorage(key);
      case "cookie":
        return this.getCookies(key, params);
      default:
        throw new Error("Invalid storage type");
    }
  }
  removeItem(key, options) {
    switch (this.type) {
      case "localStorage":
        this.removeLocalStorage(key);
        break;
      case "sessionStorage":
        this.removeSessionStorage(key);
        break;
      case "cookie":
        this.removeCookies(key, options);
        break;
      default:
        throw new Error("Invalid storage type");
    }
  }
  clear() {
    switch (this.type) {
      case "localStorage":
        this.clearLocalStorage();
        break;
      case "sessionStorage":
        this.clearSessionStorage();
        break;
      case "cookie":
        this.clearCookies();
        break;
      default:
        throw new Error("Invalid storage type");
    }
  }
}
function getToken(key) {
  const setKey = key || index.tokenkeys.TOKEN_KEY;
  const { type } = index.storageOptions;
  const storage = new Storage(type);
  return storage.getItem(setKey);
}
function setToken(token) {
  const { type } = index.storageOptions;
  const storage = new Storage(type);
  return storage.setItem(index.tokenkeys.TOKEN_KEY, token);
}
function removeToken(domain) {
  const { type } = index.storageOptions;
  const storage = new Storage(type);
  removeOAToken(domain);
  return storage.removeItem(index.tokenkeys.TOKEN_KEY);
}
function getOAToken(domain) {
  let key = null;
  let oaToken = null;
  const { type } = index.storageOptions;
  const storage = new Storage(type);
  for (const keys of index.tokenkeys.OA_TOKEN_KEYS) {
    oaToken = storage.getItem(keys, {
      domain
    });
    if (oaToken) {
      key = keys;
      break;
    }
  }
  return {
    key,
    oaToken
  };
}
function removeOAToken(domain) {
  const { type } = index.storageOptions;
  const storage = new Storage(type);
  index.tokenkeys.OA_TOKEN_KEYS.forEach(
    (key) => storage.removeItem(key, {
      domain
    })
  );
}
function filterRoutes(routesInstans, routesMenuNames) {
  for (let i = 0; i < routesInstans.length; i++) {
    const route = routesInstans[i];
    if (route.children) {
      filterRoutes(route.children, routesMenuNames);
    }
    if (routesMenuNames && routesMenuNames.length > 0 && !(route == null ? void 0 : route.hidden)) {
      route.hidden = routesMenuNames.indexOf(route.name) < 0;
    }
  }
}
const useRoutesStore = pinia.defineStore({
  id: "routes-store",
  state: () => ({
    routes: [],
    // 权限路由
    addRoutes: [],
    // 异步路由
    adminRoutes: [],
    //后台管理异步路由
    showRouters: {}
    // 后台管理-二级展示的路由
  }),
  getters: {
    // 所有路由
    getRoutes() {
      return this.routes;
    },
    // 异步路由
    getAddRoutes() {
      return this.addRoutes;
    },
    // 二级菜单展示路由
    getShowRouters() {
      return this.showRouters;
    },
    getAdminRoutes(asyncRoutes) {
      var _a;
      const asyncRoute = asyncRoutes[0] && ((_a = asyncRoutes[0]) == null ? void 0 : _a.children);
      return asyncRoute;
    }
  },
  actions: {
    // 设置侧边栏路由
    SetRoutes(asyncFilterRoutes, constantAsyncRoutes) {
      this.routes = constantAsyncRoutes.concat(asyncFilterRoutes).sort((value1, value2) => (value1 == null ? void 0 : value1.order) - (value2 == null ? void 0 : value2.order));
      this.addRoutes = asyncFilterRoutes;
      this.adminRoutes = asyncFilterRoutes.filter((route) => route.name === "AdminHome");
    },
    // 设置侧边栏路由
    SetRoute(routes) {
      this.routes = routes;
    },
    // 清空路由数据
    ClearRoute() {
      this.addRoutes = [];
      this.routes = [];
      this.showRouters = {};
    },
    // 生成异步路由
    GenerateRoutes(routesMenuNames, asyncRoutes, basicRoutes) {
      filterRoutes(basicRoutes, routesMenuNames);
      filterRoutes(asyncRoutes, routesMenuNames);
      this.SetRoutes(asyncRoutes, basicRoutes);
      return asyncRoutes;
    },
    /**
     * 设置二级菜单显示的路由
     * @param {} param0
     * @param {*} routes 当前路由对象，包含路由名称 name 或则路由路径
     * @returns
     */
    SetShowRouters(routes) {
      const { name, matched } = routes;
      let topRouteName = name;
      if (matched && matched.length > 0) {
        topRouteName = matched[0].name;
      }
      const filterRouter = this.routes.map((item) => {
        if (item.name !== topRouteName) {
          item.hidden = true;
        } else {
          item.hidden = false;
        }
        return item;
      });
      this.SetRoute(filterRouter);
      return routes;
    }
  }
});
function routesStoreWithOut() {
  return useRoutesStore(index$1.store);
}
const useUserStore = pinia.defineStore({
  id: "user-store",
  state: () => ({
    authority: {
      menuNames: [],
      // 菜单权限名称列表
      rule: []
      // 按钮级别权限
    },
    // token
    token: void 0,
    expire: void 0,
    oa: {
      ticketName: null,
      ticketValue: null
    }
  }),
  getters: {
    getToken() {
      return getToken();
    },
    getAuthority() {
      return this.authority || {};
    }
  },
  actions: {
    SetToken(data) {
      const {
        oa = { ticketName: null, ticketValue: null },
        token = null
      } = data;
      this.token = token || "";
      this.oa = oa;
      setToken(token);
      if (oa.ticketName) {
        Storage.setCookies(oa.ticketName, oa.ticketValue);
      }
    },
    SetAuthority(authority) {
      this.authority = authority;
    },
    // 获取用户权限列表
    async GetAuthority(getAuthList, domain) {
      try {
        if (typeof getAuthList !== "function") {
          return Error("getAuthList 参数错误");
        }
        const authority = {
          menuNames: [],
          // 菜单权限名称列表
          rule: []
          // 按钮级别权限
        };
        const data = await getAuthList();
        authority.menuNames = data.menuNames;
        authority.rule = data.rule;
        this.SetAuthority(authority);
        return authority;
      } catch (error) {
        this.ClearLocal(domain);
        return null;
      }
    },
    // 使用 oa token 登录系统
    async CheckOaLogin(checkOaLogin, domain) {
      const { key, oaToken } = getOAToken(domain);
      if (!oaToken)
        return false;
      try {
        if (typeof checkOaLogin !== "function") {
          return Error("checkOaLogin 参数错误");
        }
        const data = await checkOaLogin({
          ticketName: key,
          ticketValue: oaToken
        });
        return data;
      } catch (error) {
        this.Logout(domain);
      }
    },
    // 退出
    async Logout(domain) {
      try {
      } catch (error) {
        console.error(error);
      } finally {
        this.ClearLocal(domain);
        location.hash = "/login";
      }
    },
    //清空存储数据
    ClearLocal(domain) {
      removeToken(domain);
      Storage.clearLocalStorage();
      Storage.clearSessioStorage();
      Storage.clearCookies();
    }
  }
});
function useUserStoreWithOut() {
  return useUserStore(index$1.store);
}
const routeStore = routesStoreWithOut();
const userStore = useUserStoreWithOut();
async function createPermissionGuard(router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message) {
  router.isReady().then(() => {
    router.beforeEach(async (to, from, next) => {
      if (getToken()) {
        return await routerPermission(to, from, next, whiteList, asyncRoutes, basicRoutes, getAuthList, domain, Message);
      } else {
        const { oaToken } = getOAToken(domain);
        if (oaToken) {
          try {
            await userStore.CheckOaLogin(checkOaLogin, domain);
            return next();
          } catch (err) {
            userStore.ClearLocal(domain);
            return next("/login?redirect=" + to.path);
          }
        } else if (whiteList.includes(to.name)) {
          return next();
        } else {
          return next("/login?redirect=" + to.path);
        }
      }
    });
  });
}
async function routerPermission(to, from, next, whiteList, asyncRoutes, basicRoutes, getAuthList, domain, Message) {
  if (to.path == "/login" && from) {
    if (from.path === "/login" || "/") {
      return next();
    } else {
      return next(from.path);
    }
  } else {
    const canAccess = await canUserAccess(to, whiteList, asyncRoutes, basicRoutes, getAuthList, domain);
    if (canAccess) {
      return next();
    } else {
      if (Message) {
        Message({
          message: "您没有权限访问页面,请联系系统管理员!",
          type: "warning"
        });
      } else {
        alert("您没有权限访问页面,请联系系统管理员!");
      }
      return false;
    }
  }
}
async function canUserAccess(to, whiteList, asyncRoutes, basicRoutes, getAuthList, domain) {
  var _a;
  if (!to || (to == null ? void 0 : to.name) === "Login")
    return false;
  try {
    let accessRoutes = userStore.getAuthority || {};
    if ((accessRoutes == null ? void 0 : accessRoutes.menuNames) && ((_a = accessRoutes == null ? void 0 : accessRoutes.menuNames) == null ? void 0 : _a.length) === 0) {
      accessRoutes = await userStore.GetAuthority(getAuthList, domain);
      routeStore.GenerateRoutes((accessRoutes == null ? void 0 : accessRoutes.menuNames) || [], asyncRoutes, basicRoutes);
    }
    const allRoutes = [...whiteList, ...accessRoutes == null ? void 0 : accessRoutes.menuNames];
    return allRoutes.length > 0 && allRoutes.includes(to.name);
  } catch (err) {
    userStore.Logout(domain);
    return false;
  }
}
async function setupRouterGuard(pOptions) {
  const { router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = pOptions;
  createPermissionGuard(router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message);
}
exports.setupRouterGuard = setupRouterGuard;
