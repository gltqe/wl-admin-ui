import {useMenuStore} from "@/stores/modules/menu.js";

export default {
    mounted(el, binding, vnode) {
        const menuStore = useMenuStore()
        const permission = binding.value
        const permissionList = menuStore.permission
        if (permission && permission.length) {
            if (Array.isArray(permission)) {
                if (!permissionList.some(item => item === permission || permission.includes(item))) {
                    el.remove();
                }
            } else if (typeof permission === 'string') {
                if (!permissionList.some(item => item === permission)) {
                    el.remove();
                }
            } else {
                throw new Error('仅支持数组或字符串类型');
            }
        } else {
            throw new Error('请设置操作权限');
        }
    }
}
