"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index = require("./index-fX0jpBtv.cjs.js");
async function setupRouterGuard(options) {
  const { router, Message } = options;
  await index.createPermissionGuard(router, Message);
  index.reloadHacker();
}
exports.setupRouterGuard = setupRouterGuard;
