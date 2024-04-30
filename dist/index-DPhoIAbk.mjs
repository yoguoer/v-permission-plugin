import { createPinia } from "pinia";
function hasPiniaBeenSetup(app) {
  return app.config.globalProperties.$pinia !== void 0;
}
const store = createPinia();
function setupStore(app) {
  if (!hasPiniaBeenSetup(app)) {
    app.use(store);
  } else {
    console.log("Pinia has already been set up.");
  }
}
export {
  setupStore,
  store
};
