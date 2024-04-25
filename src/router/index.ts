import type { Router } from 'vue-router';
import { createPermissionGuard } from './permissionGuard';
import type { AppRouteModule } from "@/utils/types";

// 定义一个接口来描述函数需要的参数对象  
interface PermissionGuardOptions {
    router: Router;  //路由对象
    whiteList: string[]; //白名单
    asyncRoutes: AppRouteModule[]; //异步路由
    basicRoutes: AppRouteModule[]; //基础路由
    getAuthList: Function, // 获取用户权限列表
    checkOaLogin: Function, // 检查oa登录状态
    domain: string, // oa 域名
    Message: Function, // 消息提示
}

// 使用接口作为函数参数的类型 
export function setupRouterGuard(options: PermissionGuardOptions) {
    // 在函数体内，可以通过 options 对象来访问传入的参数  
    const { router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = options;
    // 使用参数
    createPermissionGuard(router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message)
}
