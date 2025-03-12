import {cloneVNode, createVNode, render} from "vue"
import Loading from "@/components/loading/loading.vue"

// 创建基础VNode（单例）
const baseVNode = createVNode(Loading)

// WeakMap实例管理
const loadingInstances = new WeakMap()

export default {
    mounted(el, binding) {
        const vNode = cloneVNode(baseVNode)

        const originalStyles = {
            position: el.style.position,
            overflow: el.style.overflow,
            // 添加对宽高的保存，以确保遮罩层能正确覆盖
            width: el.style.width,
            height: el.style.height,
        }
        // 设置必要的样式以确保遮罩层正确显示
        el.style.position = 'relative'; // 确保父元素有定位
        el.style.width = '100%'; // 确保父元素有宽度（如果需要）
        el.style.height = '100%'; // 确保父元素有高度（如果需要）
        el.style.overflow = 'hidden'; // 防止内容溢出影响遮罩层

        render(vNode, el)
        loadingInstances.set(el, {vNode, originalStyles, visible: binding.value})

        if (binding.value) {
            vNode.component?.exposed?.showLoading()
        }
    },

    updated(el, binding) {
        const instance = loadingInstances.get(el)
        if (!instance) return

        if (binding.value !== instance.visible) {
            instance.visible = binding.value
            if (binding.value) {
                instance.vNode.component?.exposed?.showLoading()
            } else {
                instance.vNode.component?.exposed?.hideLoading()
                // 恢复原始样式（除了position，因为可能需要保持relative）
                el.style.overflow = instance.originalStyles.overflow;
                el.style.width = instance.originalStyles.width;
                el.style.height = instance.originalStyles.height;
            }
        }
    },

    beforeUnmount(el) {
        const instance = loadingInstances.get(el)
        if (instance) {
            render(null, el)
            // 恢复原始样式
            el.style.position = instance.originalStyles.position;
            el.style.overflow = instance.originalStyles.overflow;
            el.style.width = instance.originalStyles.width;
            el.style.height = instance.originalStyles.height;
            loadingInstances.delete(el);
        }
    }
}


