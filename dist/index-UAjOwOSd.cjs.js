"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vueRouter = require("vue-router");
const index = require("./index-fX0jpBtv.cjs.js");
function toCreateRouter(publicPath, asyncRoutes, basicRoutes) {
  return vueRouter.createRouter({
    // 创建一个 hash 历史记录。
    history: index.globalState.getState("routerMode") === "hash" ? vueRouter.createWebHashHistory(publicPath) : vueRouter.createWebHistory(publicPath),
    // 应该添加到路由的初始路由列表。
    routes: [...asyncRoutes, ...basicRoutes]
  });
}
function hasRouteraBeenSetup(app) {
  return app.config.globalProperties.$router !== void 0;
}
function setupRouter(Options) {
  const { app, router, publicPath, asyncRoutes, basicRoutes } = Options;
  let route;
  if (!router && !hasRouteraBeenSetup(app)) {
    route = toCreateRouter(publicPath, asyncRoutes, basicRoutes);
    app.use(route);
  } else {
    route = router || app.config.globalProperties.$router;
    console.log("router has already been set up.");
  }
  return route;
}
exports.setupRouter = setupRouter;
exports.toCreateRouter = toCreateRouter;
