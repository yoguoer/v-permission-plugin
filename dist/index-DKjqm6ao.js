"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const pinia = require("pinia");
function hasPiniaBeenSetup(app) {
  return app.config.globalProperties.$pinia !== void 0;
}
const store = pinia.createPinia();
function setupStore(app) {
  if (!hasPiniaBeenSetup(app)) {
    app.use(store);
  } else {
    console.log("Pinia has already been set up.");
  }
}
exports.setupStore = setupStore;
exports.store = store;
