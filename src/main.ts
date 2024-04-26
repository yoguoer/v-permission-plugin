import type { Router } from 'vue-router';
import type { AppRouteModule } from "@/utils/types";

// 初始化路由
const initRoute = async (app: any, options: permissionOptions) => {
  const { historyPath, router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
  const rOptions = { app, historyPath, asyncRoutes, basicRoutes }
  const pOptions = { router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message }
  await import("@/router").then(async (router: any) => {
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

export interface permissionOptions {
  historyPath: string,
  router?: Router,  // 路由对象
  whiteList: string[], // 白名单
  asyncRoutes: AppRouteModule[], // 异步路由
  basicRoutes: AppRouteModule[], // 基础路由
  getAuthList: Function, // 获取用户权限列表
  checkOaLogin: Function, // 检查oa登录状态
  domain: string, // oa 域名
  Message: Function, // 消息提示
}
async function bootstrap(app: any, options: permissionOptions) {
  await initStore(app);
  await initRoute(app, options);
}

export default bootstrap
