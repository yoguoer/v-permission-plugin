const initRoute = async (app, options) => {
  const { publicPath, router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
  const rOptions = { app, router, publicPath, asyncRoutes, basicRoutes };
  return await import("./index-ytKcEVbx.mjs").then(async (routerMethod) => {
    const routeInstance = routerMethod.setupRouter(rOptions);
    const guard = await import("./index-S7g4wDj-.mjs");
    const pOptions = { router: routeInstance, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message };
    guard.setupRouterGuard(pOptions);
  });
};
const initStore = async (app) => {
  await import("./index-DPhoIAbk.mjs").then(async (store) => {
    await store.setupStore(app);
  });
};
async function initPermission(app, options) {
  await initStore(app);
  await initRoute(app, options);
}
export {
  initPermission as default
};
