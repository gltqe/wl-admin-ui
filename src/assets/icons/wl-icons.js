// 注册所有 本地图标
let wlIcons = []
const modules = import.meta.glob('./svg/*.svg');
for (const path in modules) {
    const p = path.split('./svg/')[1].split('.svg')[0];
    wlIcons.push(p);
}

export default wlIcons
