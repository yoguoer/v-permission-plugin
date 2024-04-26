import { createRouter, createWebHashHistory } from "vue-router";
function toCreateRouter(publicPath, asyncRoutes, basicRoutes) {
  return createRouter({
    // 创建一个 hash 历史记录。
    history: createWebHashHistory(publicPath),
    // 应该添加到路由的初始路由列表。
    routes: [...asyncRoutes, ...basicRoutes]
  });
}
function setupRouter(rOptions) {
  const { app, publicPath, asyncRoutes, basicRoutes } = rOptions;
  let router = app.$router;
  if (!router) {
    router = toCreateRouter(publicPath, asyncRoutes, basicRoutes);
    app.use(router);
  } else {
    console.log("router has already been set up.");
  }
  return router;
}
export {
  setupRouter,
  toCreateRouter
};
