import {useMenuStore} from "@/stores/modules/menu.js";
import {ACCESS_HEAD,REFRESH_HEAD} from "@/common/constant.js";
import {useUserStore} from "@/stores/modules/user.js";
// 不能在这里使用
// const menuStore = useMenuStore()

export function getToken () {
  return localStorage.getItem(ACCESS_HEAD)
}
export function hasPermission (permission) {
  return !(useMenuStore().permission.indexOf(permission) !== -1)
}
export function logoutClear () {
  localStorage.setItem(ACCESS_HEAD, '')
  useMenuStore().resetMenu()
  useUserStore().resetUser()

  // todo
 // store.commit('menu/refreshMenu')
 // store.commit('tag/refreshTag')
 // store.commit('user/refreshUser')
}
