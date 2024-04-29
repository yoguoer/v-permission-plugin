"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
function getChildValue(data = [], arr = [], key = "", children = "children") {
  if (!key || data.length <= 0)
    return;
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
const tokenkeys = {
  TOKEN_KEY: "_TOKEN__",
  OA_TOKEN_KEYS: ["SIAMTGT", "SIAMJWT"],
  LOCALE_KEY: "_LOCALE__",
  USER_INFO_KEY: "_USER__INFO__",
  USER_AUTHORITY_KEY: "_USER__AUTHORITY__",
  USER_ASYNC_ROUTE_KEY: "_USER_ASYNC_ROUTE_"
};
function setKeys(keyOptions) {
  if (keyOptions.token_key)
    tokenkeys.TOKEN_KEY = keyOptions.token_key;
  if (keyOptions.oa_token_keys)
    tokenkeys.OA_TOKEN_KEYS = keyOptions.oa_token_keys;
  if (keyOptions.locale_key)
    tokenkeys.LOCALE_KEY = keyOptions.locale_key;
  if (keyOptions.user_info_key)
    tokenkeys.USER_INFO_KEY = keyOptions.user_info_key;
  if (keyOptions.user_authority_key)
    tokenkeys.USER_AUTHORITY_KEY = keyOptions.user_authority_key;
  if (keyOptions.user_async_route_key) {
    tokenkeys.USER_ASYNC_ROUTE_KEY = keyOptions.user_async_route_key;
  }
}
const storageOptions = {
  type: "cookie",
  expires: void 0
};
function setStorage(options) {
  const { type, expires } = options;
  if (type)
    storageOptions.type = type;
  if (expires)
    storageOptions.expires = expires;
}
const initRoute = async (app, options) => {
  const { publicPath, router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
  const rOptions = { app, router, publicPath, asyncRoutes, basicRoutes };
  return await Promise.resolve().then(() => require("./index-ClJ3DnKQ.js")).then(async (routerMethod) => {
    const routeInstance = routerMethod.setupRouter(rOptions);
    const guard = await Promise.resolve().then(() => require("./index-Bc-BMxCV.js"));
    const pOptions = { router: routeInstance, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message };
    guard.setupRouterGuard(pOptions);
  });
};
const initStore = async (app) => {
  await Promise.resolve().then(() => require("./index-DKjqm6ao.js")).then(async (store) => {
    await store.setupStore(app);
  });
};
async function initPermission(app, options) {
  await initStore(app);
  await initRoute(app, options);
}
exports.default = initPermission;
exports.getRouteNames = getRouteNames;
exports.setKeys = setKeys;
exports.setStorage = setStorage;
exports.storageOptions = storageOptions;
exports.tokenkeys = tokenkeys;
