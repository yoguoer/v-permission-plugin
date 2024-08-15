import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { g as globalState } from "./index-DjAFU_cK.es.js";
function toCreateRouter(publicPath, asyncRoutes, basicRoutes) {
  return createRouter({
    // 创建一个 hash 历史记录。
    history: globalState.getState("routerMode") === "hash" ? createWebHashHistory(publicPath) : createWebHistory(publicPath),
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
export {
  setupRouter,
  toCreateRouter
};
