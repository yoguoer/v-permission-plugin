"use strict";
const initRoute = async (app, options) => {
  const { publicPath, router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
  const rOptions = { app, publicPath, asyncRoutes, basicRoutes };
  await Promise.resolve().then(() => require("./index-eIRXlEVZ.js")).then(async (router2) => {
    const pOptions = { router: router2, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message };
    router2.setupRouter(rOptions);
    const guard = await Promise.resolve().then(() => require("./index-B-vpgglp.js"));
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
