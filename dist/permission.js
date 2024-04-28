"use strict";
const initRoute = async (app, options) => {
  const { publicPath, router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
  const rOptions = { app, router, publicPath, asyncRoutes, basicRoutes };
  return await Promise.resolve().then(() => require("./index-7vmBGxb5.js")).then(async (routerMethod) => {
    const routeInstance = routerMethod.setupRouter(rOptions);
    const guard = await Promise.resolve().then(() => require("./index-B-vpgglp.js"));
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
module.exports = initPermission;
