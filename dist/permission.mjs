const initRoute = async (app, options) => {
  const { publicPath, router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
  const rOptions = { app, publicPath, asyncRoutes, basicRoutes };
  await import("./index-CBmSYMv2.mjs").then(async (router2) => {
    const pOptions = { router: router2, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message };
    router2.setupRouter(rOptions);
    const guard = await import("./index-S7g4wDj-.mjs");
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
