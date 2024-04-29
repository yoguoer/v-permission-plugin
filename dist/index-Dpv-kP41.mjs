import { createPermissionGuard } from "./permission.mjs";
async function setupRouterGuard(pOptions) {
  const { router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = pOptions;
  createPermissionGuard(router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message);
}
export {
  setupRouterGuard
};
