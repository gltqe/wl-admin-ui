// 参考ruoyi vue3版 注册所有icon图标
import * as components from '@element-plus/icons-vue'

export let elIcons = [];
export default {
    install: (app) => {
        let keys = []
        for (const key in components) {
            const componentConfig = components[key];
            app.component(componentConfig.name, componentConfig);
            keys.push(key)
        }
        elIcons = keys
    },
};
