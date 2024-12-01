import {createRouter, createWebHistory} from 'vue-router'
import {getToken} from '@/utils/auth'
import {useMenuStore} from '../stores/modules/menu.js'
import {useUserStore} from '../stores/modules/user.js'
import Layout from '@/components/layout/index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_ROUTER),
    routes: [
        {
            path: '/',
            redirect: '/main'
        },
        {
            path: '/login',
            name: 'LoginView',
            component: () => import('@/views/login/index.vue')
        },
        {
            path: '/user',
            component: Layout,
            children: [
                {
                    path: '/self',
                    name: 'Self',
                    component: () => import('@/views/system/user/self/index.vue'),
                    meta: {title: '个人中心'}
                }
            ]
        },
        {
            path: '/dict',
            component: Layout,
            children: [
                {
                    path: '/dictItem/:code/:name',
                    name: 'DictItem',
                    component: () => import('@/views/system/dict/item/index.vue'),
                    meta: {title: '字典项'}
                }
            ]
        },

        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/common/E404.vue')
        }
    ]
})

// export function resetRouter () {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher
// }

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
    // 举例:  /  重定向  /main --- /main不在白名单  --- 检验token --- 无token --- 到/login --- /login在白名单  ---直接跳转
    if (whiteList.indexOf(to.path) !== -1) {
        // 在白名单 直接跳转
        next()
    } else {
        if (getToken()) {
            // 有 token
            if (to.path === '/login') {
                // 跳转登录页面 重定向到其他页面
                next(`/login?redirect=${to.fullPath}`)
            } else {
                const userStore = useUserStore()
                const menuStore = useMenuStore()
                // 不是跳转登录页 判断是否已经加载了菜单权限 to.fullPath 带参数的完整路径
                if (menuStore.menuList.length === 0) {
                    // 获取userInfo 和 menuList
                    userStore.setUserInfo().then(res => {
                        if (res.data.code === 200) {
                            menuStore.setMenuList().then(res => {
                                // resetRouter()
                                // replace: true只是一个设置信息，告诉VUE本次操作后，不能通过浏览器后退按钮，返回前一个路由。
                                // 如果参数to不能找到对应的路由的话，就再执行一次beforeEach((to, from, next)直到其中的next({ …to})能找到对应的路由为止
                                next({...to, replace: true})
                            })
                        }
                    })
                } else {
                    // 已经加载menuList  直接跳转
                    next()
                }
            }
        } else {
            // 无  token
            next(`/login?redirect=${to.fullPath}`)
        }
    }
})

export default router
