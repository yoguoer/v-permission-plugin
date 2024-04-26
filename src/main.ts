import type { permissionOptions } from "@/types/store";

// 初始化路由
const initRoute = async (app: any, options: permissionOptions) => {
  const { historyPath, router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
  const rOptions = { app, historyPath, asyncRoutes, basicRoutes }
  await import("@/router").then(async (router: any) => {
    const pOptions = { router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message }
    // 配置路由
    router.setupRouter(rOptions);
    const guard = await import("@/router/guard");
    // 路由守卫
    guard.setupRouterGuard(pOptions);
  });
}

// 初始化 store
const initStore = async (app: any) => {
  await import("@/store").then(async (store: any) => {
    // 配置状态仓库
    await store.setupStore(app);
  });
}


async function bootstrap(app: any, options: permissionOptions) {
  await initStore(app);
  await initRoute(app, options);
}

export default bootstrap
