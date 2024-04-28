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
export {
  setupRouter,
  toCreateRouter
};
