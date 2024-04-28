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
function setupRouter(rOptions) {
  const { app, router, publicPath, asyncRoutes, basicRoutes } = rOptions;
  let route;
  if (!router) {
    route = toCreateRouter(publicPath, asyncRoutes, basicRoutes);
    app.use(route);
  } else {
    route = router;
    console.log("router has already been set up.");
  }
  return route;
}
exports.setupRouter = setupRouter;
exports.toCreateRouter = toCreateRouter;
