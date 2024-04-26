# permission插件

## 1. 安装相关依赖

- js-cookie

```bash
# npm
npm install js-cookie
```

```bash
# yarn
yarn install js-cookie
```

```bash
# pnpm
pnpm install js-cookie
```

- pinia

```bash
# npm
npm install pinia
```

```bash
# npm
npm install pinia
```

```bash
# pnpm
pnpm install pinia
```

- vue-router

```bash
# npm
npm install vue-router@4
```

```bash
# yarn
yarn install vue-router@4
```

```bash
# pnpm
pnpm install vue-router@4
```

## 2. 安装插件

```bash
# npm
npm install vivien-permission
```

```bash
# yarn
yarn install vivien-permission
```

```bash
# pnpm
pnpm install vivien-permission
```

## 3. 使用插件

### 引入vivien-perimission

在你的项目中直接引入 XW-UI 的 vivien-perimission 插件

```javascript
import { createApp } from 'vue'
import App from './views/App.vue'
import { createPinia } from 'pinia'
import bootstrap from "vivien-permission"
import { whiteList, asyncRoutes, basicRoutes } from "这是你的接口路由配置"
import { getAuthList, checkOaLogin } from "这是你的接口"
import router from '这是你的router实例';  
import ElMessage from '这是你的消息提示';  

const app = createApp(App);
const pinia = createPinia()

app.use(router)
.use(pinia)

const domain = '.tcl.com'
const publicPath = import.meta.env.VITE_PUBLIC_PATH
//定义一个符合 permissionOptions 接口的对象 
const options ={
  publicPath, // 历史记录路径
  router,  // 路由对象（可选）
  whiteList, // 白名单
  asyncRoutes, // 异步路由
  basicRoutes, // 基础路由
  getAuthList, // 获取用户权限列表
  checkOaLogin, // 检查oa登录状态
  domain, // oa 域名
  ElMessage // 消息提示
}

await bootstrap(app, options)

app.mount('#app')

```

