import { getChildValue } from "@/utils/index"

export default function gerRouteNames(data: any){
    let menuNames: Array<T> = []
     // 递归获取后端路由 name 的数组存入 leftMenuNames
     getChildValue(data?.menu || [], menuNames, 'name', 'children')
     data.menuNames = menuNames
     return data
}