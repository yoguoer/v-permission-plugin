
// 初始化路由
const initRoute = async (app: any) => {
  await import("@/router").then(async (router: any) => {
    // 配置路由
    router.setupRouter(app);
    const guard = await import("@/router/index");
    // 路由守卫
    guard.setupRouterGuard(router.router);
  });
}

// 初始化 store
const initStore = async (app: any) => {
  await import("@/store").then(async (store: any) => {
    // 配置状态仓库
    await store.setupStore(app);
  });
}

async function bootstrap(app: any) {
  await initStore(app);
  await initRoute(app);
}

export default bootstrap
