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
import { vivienPermission } from "xw-ui/vivien-permission";
import { whiteList, asyncRoutes, basicRoutes } from "@/router/setRoutes"
import { getAuthList, checkOaLogin } from "@/api/login"

const domain = '.tcl.com'

// 初始化路由
const initRoute = async (app: any) => {
  await import("@/router").then(async (router: any) => {
    // 配置路由
    router.setupRouter(app);
    const guard = vivienPermission
    const options ={     
      router, //路由对象
      whiteList, //白名单
      asyncRoutes,//异步路由
      basicRoutes,//基础路由
      getAuthList, // 获取用户权限列表
      checkOaLogin, // 检查oa登录状态
      domain, // oa 域名
      ElMessage, // 消息提示
    }
    // 路由守卫
    guard.setupRouterGuard(options);
  });
}
```

