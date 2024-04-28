"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vueRouter = require("vue-router");
function toCreateRouter(publicPath, asyncRoutes, basicRoutes) {
  return vueRouter.createRouter({
    // 创建一个 hash 历史记录。
    history: vueRouter.createWebHashHistory(publicPath),
    // 应该添加到路由的初始路由列表。
    routes: [...asyncRoutes, ...basicRoutes]
  });
}
function hasRouteraBeenSetup(app) {
  return app.config.globalProperties.$router !== void 0;
}
function setupRouter(rOptions) {
  const { app, publicPath, asyncRoutes, basicRoutes } = rOptions;
  let router;
  if (!hasRouteraBeenSetup(app)) {
    router = toCreateRouter(publicPath, asyncRoutes, basicRoutes);
    app.use(router);
  } else {
    router = app.$router;
    console.log("router has already been set up.");
  }
  return router;
}
exports.setupRouter = setupRouter;
exports.toCreateRouter = toCreateRouter;
