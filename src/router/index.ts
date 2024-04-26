import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import type { AppRouteModule } from "@/types/router";
import type { setupRouterOptions } from "@/types/store";

// 创建一个可以被 Vue 应用程序使用的路由实例
export function toCreateRouter(
  historyPath: string, // 历史记录路径
  asyncRoutes: AppRouteModule[], // 异步路由
  basicRoutes: AppRouteModule[] // 基础路由
  ) {
    return createRouter({
      // 创建一个 hash 历史记录。
      history: createWebHashHistory(historyPath),
      // 应该添加到路由的初始路由列表。
      routes: [...asyncRoutes, ...basicRoutes] as unknown as RouteRecordRaw[],
      // 是否应该禁止尾部斜杠。默认为假
      strict: false,
      scrollBehavior: () => ({ left: 0, top: 0 }),
    });
}

// 定义一个接口来描述函数需要的参数对象  


// config router
// 配置路由器
export function setupRouter(rOptions: setupRouterOptions) {
  const { app, historyPath, asyncRoutes, basicRoutes } = rOptions;
  let router = app.$router; // 尝试从应用实例上获取路由器
  if (!router) {
    // 如果没有设置router，则创建并使用它  
    router = toCreateRouter(historyPath, asyncRoutes, basicRoutes);  
    app.use(router);  
  } else {
    // 已经设置路由  
    console.log('router has already been set up.');  
  }
  return router; // 无论app.$router是否存在，都会返回路由实例
}

