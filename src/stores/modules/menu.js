import {defineStore} from 'pinia'
import {getMenuPermission} from "@/api/system/menu.js";
import router from '@/router/index'
import Layout from '@/components/layout/index.vue'

export const useMenuStore = defineStore('menu', {
    state: () => ({
        menuList: [],
        permission: [],
        menuCollapse: false,
        // 页面缩小后激活菜单
        menuActive: false,
        defaultActiveMenuId: ''
    }),
    getters: {},
    actions: {
        setMenuList() {
            return new Promise((resolve, reject) => {
                getMenuPermission().then(res => {
                    if (res.data.data) {
                        this.menuList = res.data.data
                        this.permission = getRouters(res.data.data)
                    }
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        resetMenu() {
            this.permission = []
            this.menuList = []
        },
        // 页面激活后 隐藏或出现
        activeMenu() {
            this.menuCollapse = false
            this.menuActive = !this.menuActive
        },
        // 收起菜单
        collapseMenu() {
            this.menuCollapse = !this.menuCollapse
        }
    }
})

function getRouters(menuList) {
    const buttonPermission = []
    const routers = []
    if (menuList && menuList.length > 0) {
        menuList.forEach(menu => {
            const titleList = [menu.name]
            if (menu.type === '0') {
                // 扁平化
                const router = {
                    path: menu.path,
                    name: menu.name,
                    children: menu.children,
                    meta: {title: menu.name, id: menu.id, titleList: titleList}
                }
                const routerList = getChildren(router, buttonPermission)
                // routers.push.apply(routers, routerList)
                routers.push({
                    path: menu.path,
                    name: menu.name,
                    children: routerList,
                    meta: {title: menu.name, id: menu.id, titleList: titleList}
                })
            }
            if (menu.type === '1') {
                // 处理菜单
                buttonPermission.push.apply(buttonPermission, getPermission(menu))
                const router = {
                    path: menu.path,
                    name: menu.componentName,
                    component: _import(menu.component),
                    meta: {title: menu.name, id: menu.id, titleList: titleList}
                }
                routers.push(router)
            }
        })
    }
    let routeResult = {path: '/', name: '主菜单', component: Layout, children: routers, meta: {title: '主菜单'}}
    router.addRoute(routeResult)
    router.addRoute({path: '/:pathMatch(.*)*', redirect: '/404'})
    return buttonPermission
}

function getChildren(menu, buttonPermission) {
    const result = []
    if (menu && menu.children && menu.children.length > 0) {
        menu.children.forEach(c => {
            c.path = menu.path + c.path
            const titleList = menu.meta.titleList.concat(c.name)
            if (c.type === '0') {
                const router = {
                    path: c.path,
                    name: c.name,
                    children: c.children,
                    meta: {title: c.name, id: c.id, titleList: titleList}
                }
                const routerList = getChildren(router, buttonPermission)
                // result.push.apply(result, routerList)
                result.push({
                    path: c.path,
                    name: c.name,
                    children: routerList,
                    meta: {title: c.name, id: c.id, titleList: titleList}
                })
            }
            if (c.type === '1') {
                buttonPermission.push.apply(buttonPermission, getPermission(c))
                const router = {
                    path: c.path,
                    name: c.componentName,
                    component: _import(c.component),
                    meta: {title: c.name, id: c.id, titleList: titleList}
                }
                result.push(router)
            }
        })
    }
    return result
}

function getPermission(menu) {
    const permissionList = []
    if (menu && menu.children && menu.children.length > 0) {
        menu.children.forEach(button => {
            permissionList.push(button.permission)
        })
    }
    return permissionList
}

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')
const Error404 = import.meta.glob('./../../views/common/E404.vue')

const componentList = {}
for (const path in modules) {
    if (path.includes('/views')) {
        const dir = path.split('/views')[1].split('.vue')[0];
        componentList[dir] = () => modules[path]()
    }
}

function _import(component) {
    if (componentList[component] && componentList[component] !== null) {
        return componentList[component];
    } else {
        console.log('未查到组件', component)
        return () => Error404['../../views/common/E404.vue']()
    }
}
