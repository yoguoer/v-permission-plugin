import type { permissionOptions } from "@/types/store";

// 初始化路由
const initRoute = async (app: any, options: permissionOptions) => {
  const { publicPath, router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
  const rOptions = { app,router, publicPath, asyncRoutes, basicRoutes }
  return await import("@/router").then(async (routerMethod: any) => {
    // 创建路由实例
    const routeInstance  = routerMethod.setupRouter(rOptions);
    const guard = await import("@/router/guard");
    // 路由守卫
    const pOptions = { router:routeInstance, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message }
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

async function initPermission(app: any, options: permissionOptions) {
  await initStore(app);
  await initRoute(app, options);
}

export default initPermission;

//暴露处理菜单名称列表的方法
export  { getRouteNames } from '@/utils/getRouteNames'; 
// 暴露获取后台管理路由的方法
export  { getAdminRoutes } from '@/store/routes'; 
//暴露设置key的方法
export  { default as tokenkeys, setKeys }  from '@/utils/tokenKey'; 