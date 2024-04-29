"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = require("./permission.js");
async function setupRouterGuard(pOptions) {
  const { router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message } = pOptions;
  index.createPermissionGuard(router, whiteList, asyncRoutes, basicRoutes, getAuthList, checkOaLogin, domain, Message);
}
exports.setupRouterGuard = setupRouterGuard;
