
import type { Router, RouteItem } from 'vue-router';
import { getToken as toGetToken, getOAToken } from "@/utils/token";
import { routesStoreWithOut } from "@/store/routes";
import { useUserStoreWithOut } from "@/store/user";
import type { AppRouteModule } from "@/types/router";
import { Message as showMsg } from '@/plugin/Message.ts';
import { authorityType, TokenType } from "@/types/token";

const routeStore = routesStoreWithOut();
const userStore = useUserStoreWithOut();

export async function createPermissionGuard(
    router: Router,
    whiteList: string[],
    asyncRoutes: AppRouteModule[],
    basicRoutes: AppRouteModule[],
    getAuthList: Function,
    checkOaLogin: Function,
    domain: string,
    Message: Function
) {
    /**
     * 问题： 直接使用 router.beforeEach 会导致在刷新页面时无法进入 router.beforeEach 的回调函数
     * 原因：可能是因为在刷新页面时，Vue Router 的初始化过程尚未完成，导致路由守卫无法正常触发。
     * 解决方案：将 router.beforeEach 回调函数的逻辑放在一个异步函数中，并在 Vue Router 初始化完成后再调用这个异步函数。你可以使用 router.isReady() 方法来判断 Vue Router 是否已经初始化完成。
     * isReady: isReady(): Promise<void> 返回一个 Promise，它会在路由器完成初始导航之后被解析，也就是说这时所有和初始路由有关联的异步入口钩子和异步组件都已经被解析。如果初始导航已经发生，则该 Promise 会被立刻解析。
     */
    router.isReady().then(() => {

        router.beforeEach(async (to, from, next) => {
            if (toGetToken()) {
                return await routerPermission(to, from, next, whiteList, asyncRoutes, basicRoutes, getAuthList, domain, Message)
            } else {
                // 获取 oa 中的 token
                const { oaToken } = getOAToken(domain)

                if (oaToken) { // oa 存在 token，用户已经登录 oa
                    try {
                        // 使用 oa token 登录系统
                        await userStore.CheckOaLogin(checkOaLogin, domain);

                        return next();
                    } catch (err) {
                        userStore.ClearLocal(domain);
                        return next("/login?redirect=" + to.path);

                    }
                } else if (whiteList.includes(to.name as string)) {            // 用户未登录
                    return next();
                } else {
                    return next("/login?redirect=" + to.path);
                }
            }

        });
    });

}


/**
 * 路由权限判断函数,根据路由权限进入不同路由
 */
export async function routerPermission(
    to: RouteItem,
    from: RouteItem,
    next: Function,
    whiteList: string[],
    asyncRoutes: AppRouteModule[],
    basicRoutes: AppRouteModule[],
    getAuthList: Function,
    domain: string,
    Message: Function
) {

    // 已经存在 token, 进入用户登录页面
    if (to.path == '/login' && from) {
        // 从登录页面进入，直接进入登录页面
        if (from.path === '/login' || '/') {
            return next();
        } else {
            //已经存在 token, 从其他页面进入用户登录页面，直接返回来源页面
            return next(from.path);
        }
    } else {
        const canAccess = await canUserAccess(to, whiteList, asyncRoutes, basicRoutes, getAuthList, domain)
        if (canAccess) {
            return next()
        } else {
            if (Message) {
                Message({
                    message: "您没有权限访问页面,请联系系统管理员!",
                    type: "warning",
                });
            } else {
                showMsg.error({
                    message: "您没有权限访问页面,请联系系统管理员!",
                });
            }
            return false
        }
    }
}





/**
* 获取异步权限
* @param to 
* @returns 
*/
export async function canUserAccess(
    to: RouteItem,
    whiteList: string[],
    asyncRoutes: AppRouteModule[],
    basicRoutes: AppRouteModule[],
    getAuthList: Function,
    domain: string
) {
    if (!to || to?.name === "Login") return false
    try {
        let accessRoutes = userStore.getAuthority || {}
        if (accessRoutes?.menuNames && accessRoutes?.menuNames?.length === 0) {
            accessRoutes = await userStore.GetAuthority(getAuthList, domain)
            routeStore.GenerateRoutes(accessRoutes?.menuNames || [], asyncRoutes, basicRoutes)
        }
        const allRoutes = [...whiteList, ...accessRoutes?.menuNames]
        return allRoutes.length > 0 && allRoutes.includes(to.name)
    } catch (err) {
        userStore.Logout(domain)
        return false
    }

}

// --------------------------路由相关--------------------------
// 获取后台管理路由
export function getAdminRoutes(asyncRoutes: AppRouteModule[]) {
    return routeStore.getAdminRoutes(asyncRoutes || [])
}
// 获取所有路由
export function getRoutes() {
    return routeStore.getRoutes
}
// 获取异步路由
export function getAddRoutes() {
    return routeStore.getAddRoutes
}
// 获取二级菜单展示路由
export function getShowRouters() {
    return routeStore.getShowRouters
}

// 设置侧边栏路由
export async function SetRoutes(asyncFilterRoutes: Array<T>, constantAsyncRoutes: Array<T>) {
    await routeStore.SetRoutes(asyncFilterRoutes,constantAsyncRoutes)
}
// 设置侧边栏路由
export async function SetRoute(routes: Array<RouteItem>) {
    await routeStore.SetRoute(routes)
}
// 清空路由数据
export async function ClearRoute() {
    await routeStore.ClearRoute()
}
// 设置二级菜单显示的路由
export async function SetShowRouters(routes: RouteItem) {
    return await routeStore.SetShowRouters(routes)
}
// 生成异步路由
export async function GenerateRoutes(routesMenuNames: Array<RouteItem>, asyncRoutes: AppRouteModule[], basicRoutes: AppRouteModule[]) {
    return await routeStore.GenerateRoutes(routesMenuNames,asyncRoutes,basicRoutes)
}


// --------------------------用户相关--------------------------
// 获取token
export function getToken() {
    return userStore.getToken
}
// 获取权限列表
export function getAuthority() {
    return userStore.getAuthority
}

// 设置token
export async function SetToken(data: TokenType) {
    await userStore.SetToken(data)
}
// 设置权限列表
export async function SetAuthority(authority: authorityType) {
    await userStore.getAuthority(authority)
}
// 获取用户权限列表
export async function GetAuthority(getAuthList: Function, domain: string) {
    return await userStore.GetAuthority(getAuthList, domain)
}
// 使用 oa token 登录系统
export async function CheckOaLogin(checkOaLogin: Function, domain: string) {
    return await userStore.CheckOaLogin(checkOaLogin, domain)
}
// 退出
export async function Logout(domain: string) {
    await userStore.Logout(domain)
}
// 清空存储数据
export async function ClearLocal(domain: string) {
    await userStore.ClearLocal(domain)
}