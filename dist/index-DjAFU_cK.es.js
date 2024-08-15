import { createPinia, defineStore } from "pinia";
import Cookies from "js-cookie";
function isFunction(functionToCheck) {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
}
function getChildValue(data = [], arr = [], key = "", children = "children") {
  if (!key || data.length <= 0) return;
  data.forEach((item) => {
    if (item[children]) {
      getChildValue(item.children, arr, key, children);
    }
    arr.push(item[key]);
  });
}
function getRouteNames(data) {
  let menuNames = [];
  getChildValue((data == null ? void 0 : data.menu) || [], menuNames, "name", "children");
  data.menuNames = menuNames;
  return data;
}
const _GlobalState = class _GlobalState {
  // 或者使用具体的类型，如interface  
  // 私有构造函数，确保外部不能直接通过new创建实例  
  constructor() {
    this.state = {
      routerMode: "hash",
      // 路由模式
      publicPath: "",
      // 公共路径
      whiteList: [],
      // 路由白名单
      getAuthList: null,
      // 获取权限列表 api
      checkSSOLogin: null,
      // 换取 oa token api
      asyncRoutes: [],
      // 异步路由
      basicRoutes: [],
      // 基础路由
      logout: null,
      // 退出登录 api
      domain: null,
      // cookie 存储域名
      storageType: "cookie",
      // 本地数据存储类型
      expires: void 0,
      // 本地数据存储过期时间
      TOKEN_KEY: "_TOKEN__",
      // token key
      SSO_TOKEN_KEYS: [],
      // 单点登录 Keys
      homeRoute: "/"
    };
  }
  // 获取单例实例  
  static getInstance() {
    if (!_GlobalState.instance || _GlobalState.instance == null) {
      _GlobalState.instance = new _GlobalState();
    }
    return _GlobalState.instance;
  }
  // 设置全局状态, 设置单个全局状态 
  setState(key, value) {
    this.state[key] = value;
  }
  // 一次性设置全局状态  
  setAllState(initValue) {
    for (const key in initValue) {
      if (key in this.state) {
        this.state[key] = initValue[key];
      }
    }
  }
  // 获取全局状态  
  getState(key) {
    return this.state[key];
  }
};
_GlobalState.instance = null;
let GlobalState = _GlobalState;
const globalState = GlobalState.getInstance();
function hasPiniaBeenSetup(app) {
  return app.config.globalProperties.$pinia !== void 0;
}
const store = createPinia();
function setupStore(app) {
  if (!hasPiniaBeenSetup(app)) {
    app.use(store);
  } else {
    console.log("Pinia has already been set up.");
  }
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  setupStore,
  store
}, Symbol.toStringTag, { value: "Module" }));
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
const useRoutesStore = defineStore({
  id: "routes-store",
  state: () => ({
    routes: [],
    // 权限路由
    addRoutes: [],
    // 异步路由
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
    // 获取异步路由
    getAsyncRoutes() {
      var _a;
      const asyncRoutes = globalState.getState("asyncRoutes");
      if (!asyncRoutes) return void 0;
      const asyncRoute = asyncRoutes[0] && ((_a = asyncRoutes[0]) == null ? void 0 : _a.children);
      return asyncRoute;
    }
  },
  actions: {
    // 设置所有路由
    SetRoutes(asyncFilterRoutes, constantAsyncRoutes) {
      this.routes = constantAsyncRoutes.concat(asyncFilterRoutes).sort((value1, value2) => (value1 == null ? void 0 : value1.order) - (value2 == null ? void 0 : value2.order));
      this.addRoutes = asyncFilterRoutes;
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
  return useRoutesStore(store);
}
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
    let value = void 0;
    if (params) {
      value = Cookies.get(key, params);
    } else {
      value = Cookies.get(key);
    }
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
        return this.getCookies(key, params | void 0);
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
  // 清除所有
  static clearAll() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }
}
function getToken$1(key) {
  const TOKEN_KEY = globalState.getState("TOKEN_KEY");
  const setKey = TOKEN_KEY;
  const storageType = globalState.getState("storageType");
  const storage = new Storage(storageType);
  return storage.getItem(setKey);
}
function setToken(token) {
  const storageType = globalState.getState("storageType");
  const storage = new Storage(storageType);
  const TOKEN_KEY = globalState.getState("TOKEN_KEY");
  return storage.setItem(TOKEN_KEY, token || "");
}
function removeToken(domain) {
  const storageType = globalState.getState("storageType");
  const storage = new Storage(storageType);
  removeSSOToken(domain);
  const TOKEN_KEY = globalState.getState("TOKEN_KEY");
  return storage.removeItem(TOKEN_KEY);
}
function getSSOToken(domain) {
  let key = null;
  let ossToken = null;
  const storageType = globalState.getState("storageType");
  const storage = new Storage(storageType);
  const SSO_TOKEN_KEYS = globalState.getState("SSO_TOKEN_KEYS");
  for (const keys of SSO_TOKEN_KEYS) {
    ossToken = storage.getItem(keys, {
      domain
    });
    if (ossToken) {
      key = keys;
      break;
    }
  }
  return {
    key,
    ossToken
  };
}
function removeSSOToken(domain) {
  const storageType = globalState.getState("storageType");
  const storage = new Storage(storageType);
  const SSO_TOKEN_KEYS = globalState.getState("SSO_TOKEN_KEYS");
  SSO_TOKEN_KEYS.forEach(
    (key) => storage.removeItem(key, {
      domain
    })
  );
}
const useUserStore = defineStore({
  id: "user-store",
  state: () => ({
    authority: {
      menuNames: [],
      // 菜单权限名称列表，取路由表中的 name 字段
      rule: []
      // 按钮级别权限
    },
    // token
    token: void 0,
    expire: void 0,
    // token 过期时间
    oa: {
      ticketName: null,
      // oa token key
      ticketValue: null
      // oa token value
    }
  }),
  getters: {
    // 获取 token
    getToken() {
      return getToken$1();
    },
    // 获取所有权限
    getAuthority() {
      return this.authority || {
        menuNames: [],
        // 菜单权限名称列表，取路由表中的 name 字段
        rule: []
        // 按钮级别权限
      };
    }
  },
  actions: {
    // 设置 token
    SetToken(data) {
      const {
        oa = { ticketName: null, ticketValue: null },
        token = null
      } = data;
      this.token = token || "";
      this.oa = oa || { ticketName: null, ticketValue: null };
      setToken(token);
      if (oa.ticketName) {
        const storageType = globalState.getState("storageType");
        const storage = new Storage(storageType);
        storage.setItem(oa.ticketName, oa.ticketValue);
      }
    },
    // 设置用户所有权限列表
    SetAuthority(authority) {
      this.authority.menuNames = authority.menuNames;
      this.authority.rule = authority.rule;
    },
    // 获取用户权限列表
    async GetAuthority() {
      try {
        const getAuthList = globalState.getState("getAuthList");
        if (!isFunction(getAuthList)) {
          return Error("getAuthList 参数错误");
        }
        const authority = {
          menuNames: [],
          // 菜单权限名称列表
          rule: []
          // 按钮级别权限
        };
        const token = getToken$1();
        if (!token) {
          return Error("token 不存在！ ");
        }
        const data = await getAuthList({ token });
        authority.menuNames = data.menuNames;
        authority.rule = data.rule;
        this.SetAuthority(authority);
        return authority;
      } catch (error) {
        this.ClearLocal();
        return null;
      }
    },
    // 使用 oa token 登录系统
    async checkSSOLogin() {
      const domain = globalState.getState("domain");
      const checkSSOLogin2 = globalState.getState("checkSSOLogin");
      const { key, oaToken } = getSSOToken(domain);
      if (!oaToken) return false;
      try {
        if (!isFunction(checkSSOLogin2)) {
          return Error("checkSSOLogin 参数错误");
        }
        const data = await checkSSOLogin2({
          ticketName: key,
          ticketValue: oaToken
        });
        setToken(data.token);
        return data;
      } catch (error) {
        this.Logout();
      }
    },
    // 退出
    async Logout() {
      try {
        const logout = globalState.getState("logout");
        if (!isFunction(logout)) {
          return Error("logout 参数错误");
        }
        await logout({
          token: getToken$1()
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.ClearLocal();
        location.hash = "/";
      }
    },
    //清空存储数据
    ClearLocal() {
      const domain = globalState.getState("domain");
      removeToken(domain);
      Storage.clearAll();
    }
  }
});
function useUserStoreWithOut() {
  return useUserStore(store);
}
function setKeys(keyOptions) {
  const {
    TOKEN_KEY = "_TOKEN__",
    SSO_TOKEN_KEYS = []
  } = keyOptions;
  globalState.setState("TOKEN_KEY", TOKEN_KEY);
  globalState.setState("SSO_TOKEN_KEYS", SSO_TOKEN_KEYS);
}
function setStorage(options) {
  const { storageType, expires } = options;
  globalState.setState("storageType", storageType);
  globalState.setState("expires", expires);
}
const routeStore$1 = routesStoreWithOut();
const userStore$1 = useUserStoreWithOut();
function getAsyncRoutes() {
  return routeStore$1.getAsyncRoutes;
}
function getRoutes() {
  return routeStore$1.getRoutes;
}
function getAddRoutes() {
  return routeStore$1.getAddRoutes;
}
function getShowRouters() {
  return routeStore$1.getShowRouters;
}
async function SetRoutes(asyncFilterRoutes, constantAsyncRoutes) {
  await routeStore$1.SetRoutes(asyncFilterRoutes, constantAsyncRoutes);
}
async function SetRoute(routes) {
  await routeStore$1.SetRoute(routes);
}
async function ClearRoute() {
  await routeStore$1.ClearRoute();
}
async function SetShowRouters(routes) {
  return await routeStore$1.SetShowRouters(routes);
}
async function GenerateRoutes(routesMenuNames) {
  const asyncRoutes = globalState.getState("asyncRoutes");
  const basicRoutes = globalState.getState("basicRoutes");
  return await routeStore$1.GenerateRoutes(routesMenuNames, asyncRoutes, basicRoutes);
}
function getToken() {
  return userStore$1.getToken;
}
function getAuthority() {
  return userStore$1.getAuthority;
}
async function SetToken(data) {
  await userStore$1.SetToken(data);
}
async function SetAuthority(authority) {
  await userStore$1.SetAuthority(authority);
}
async function GetAuthority() {
  return await userStore$1.GetAuthority();
}
async function checkSSOLogin() {
  return await userStore$1.checkSSOLogin();
}
async function Logout() {
  await userStore$1.Logout();
}
async function ClearLocal() {
  await userStore$1.ClearLocal();
}
const exportFunctions = {
  getAsyncRoutes,
  getRoutes,
  getAddRoutes,
  getShowRouters,
  SetRoutes,
  SetRoute,
  ClearRoute,
  SetShowRouters,
  GenerateRoutes,
  getToken,
  getAuthority,
  SetToken,
  SetAuthority,
  GetAuthority,
  checkSSOLogin,
  Logout,
  ClearLocal,
  Globalstate: globalState,
  Getroutenames: getRouteNames,
  SetKeys: setKeys,
  SetStorage: setStorage
};
class Message {
  constructor(options = {}) {
    this.options = options;
    this.messageInstance = null;
    this.createMessage();
  }
  createMessage() {
    const { type, message, duration = 3e3, showClose = false, onClose } = this.options;
    const messageEl = document.createElement("div");
    messageEl.classList.add("xw-ui-http-message", `xw-ui-http-message__${type || "info"}`, "xw-ui-http-message--info");
    messageEl.style.position = "fixed";
    messageEl.style.top = "5%";
    messageEl.style.left = "50%";
    messageEl.style.transform = "translate(-50%, -50%)";
    messageEl.style.zIndex = 1e3;
    if (showClose) {
      const closeBtn = document.createElement("button");
      closeBtn.classList.add("xw-ui-http-message__close-btn");
      closeBtn.textContent = "×";
      closeBtn.onclick = () => this.close();
      messageEl.appendChild(closeBtn);
    }
    if (typeof message === "string") {
      messageEl.textContent = message;
    } else if (typeof message === "function") {
      messageEl.appendChild(message());
    }
    document.body.appendChild(messageEl);
    if (duration > 0) {
      this.timeout = setTimeout(() => this.close(), duration);
    }
    if (onClose) {
      this.onClose = onClose;
    }
    this.messageInstance = messageEl;
  }
  close() {
    if (this.messageInstance) {
      this.messageInstance.remove();
      this.messageInstance = null;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.onClose) {
      this.onClose();
    }
  }
  // 静态方法，用于创建不同类型的消息
  static create(options) {
    return new Message(options);
  }
  // 预定义不同类型的消息
  static success(options) {
    return this.create({ ...options, type: "success" });
  }
  static error(options) {
    return this.create({ ...options, type: "error" });
  }
  static warning(options) {
    return this.create({ ...options, type: "warning" });
  }
  static info(options) {
    return this.create({ ...options, type: "info" });
  }
  // 关闭所有消息的实例
  static closeAll() {
    document.querySelectorAll(".xw-ui-http-message").forEach((messageEl) => {
      messageEl.remove();
    });
  }
}
const style = document.createElement("style");
style.textContent = `
.xw-ui-http-message {
  border: 1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 40vw;
  padding: 10px;
  color: white;
  text-align: center;
}
.xw-ui-http-message__close-btn {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
.xw-ui-http-message__success {
  background-color: #67C23A;
}

.xw-ui-http-message__error {
  background-color: #F56C6C;
}

.xw-ui-http-message__info {
  background-color: #909399;
}

.xw-ui-http-message__warning {
  background-color: #E6A23C;
}
`;
document.head.appendChild(style);
const routeStore = routesStoreWithOut();
const userStore = useUserStoreWithOut();
async function createPermissionGuard(router, Message2) {
  router.isReady().then(() => {
    router.beforeEach(async (to, from, next) => {
      if (getToken$1()) {
        return await routerPermission(to, from, next, Message2);
      } else {
        const whiteList = globalState.getState("whiteList");
        const domain = globalState.getState("domain");
        const { ossToken } = getSSOToken(domain);
        if (ossToken) {
          try {
            await userStore.checkSSOLogin();
            return next();
          } catch (err) {
            userStore.ClearLocal();
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
async function routerPermission(to, from, next, Message$1) {
  if (to.path == "/login" && from) {
    if (from.path === "/login" || from.path === "/") {
      const homeRoute = globalState.getState("homeRoute");
      return next(homeRoute);
    } else {
      return next(from.path);
    }
  } else {
    const canAccess = await canUserAccess(to);
    if (canAccess) {
      return next();
    } else {
      if (Message$1) {
        Message$1({
          message: "您没有权限访问页面,请联系系统管理员!",
          type: "warning"
        });
      } else {
        Message.error({
          message: "您没有权限访问页面,请联系系统管理员!"
        });
      }
      return false;
    }
  }
}
async function canUserAccess(to) {
  var _a;
  if (!to || (to == null ? void 0 : to.name) === "Login") return false;
  const domain = globalState.getState("domain");
  try {
    const whiteList = globalState.getState("whiteList");
    let accessRoutes = userStore.getAuthority || {};
    if ((accessRoutes == null ? void 0 : accessRoutes.menuNames) && ((_a = accessRoutes == null ? void 0 : accessRoutes.menuNames) == null ? void 0 : _a.length) === 0) {
      accessRoutes = await userStore.GetAuthority();
      const asyncRoutes = globalState.getState("asyncRoutes");
      const basicRoutes = globalState.getState("basicRoutes");
      routeStore.GenerateRoutes((accessRoutes == null ? void 0 : accessRoutes.menuNames) || [], asyncRoutes, basicRoutes);
    }
    const allRoutes = [...whiteList, ...accessRoutes == null ? void 0 : accessRoutes.menuNames];
    return allRoutes.length > 0 && allRoutes.includes(to.name);
  } catch (err) {
    userStore.Logout(domain);
    return false;
  }
}
async function reloadHacker() {
  var _a;
  if (!window) return;
  if (window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
    try {
      let accessRoutes = userStore.getAuthority || {};
      const menuNames = accessRoutes == null ? void 0 : accessRoutes.menuNames;
      if (Array.isArray(menuNames) && ((_a = accessRoutes == null ? void 0 : accessRoutes.menuNames) == null ? void 0 : _a.length) === 0) {
        accessRoutes = await userStore.GetAuthority();
        const asyncRoutes = globalState.getState("asyncRoutes");
        const basicRoutes = globalState.getState("basicRoutes");
        routeStore.GenerateRoutes((accessRoutes == null ? void 0 : accessRoutes.menuNames) || [], asyncRoutes, basicRoutes);
      }
      const domain = globalState.getState("domain");
      const { ossToken } = getSSOToken(domain);
      if (!getToken$1() && !ossToken) {
        return userStore.Logout();
      }
    } catch (err) {
      return userStore.Logout();
    }
  }
}
const initRoute = async (app, options) => {
  const { publicPath, router, asyncRoutes, basicRoutes, Message: Message2 } = options;
  return await import("./index-CEGWNz5g.es.js").then(async (routerMethod) => {
    const routeInstance = routerMethod.setupRouter({ app, router, publicPath, asyncRoutes, basicRoutes });
    const guard = await import("./index-DJCMIzX_.es.js");
    await guard.setupRouterGuard({ router: routeInstance, Message: Message2 });
    return routeInstance;
  });
};
const initStore = async (app) => {
  return await Promise.resolve().then(() => index).then(async (store2) => {
    await store2.setupStore(app);
    return store2;
  });
};
async function initPermission(app, options, callback) {
  globalState.setAllState(options);
  await initStore(app);
  await initRoute(app, options);
  if (callback && isFunction(callback)) {
    callback(exportFunctions);
  }
}
export {
  getRouteNames as a,
  setStorage as b,
  createPermissionGuard as c,
  globalState as g,
  initPermission as i,
  reloadHacker as r,
  setKeys as s
};
