import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';

import path from 'path'
// https://vitejs.dev/config/
export default defineConfig((conditionalConfig)=>{
    // conditionalConfig对象包含4个字段
    const { mode, command, isSsrBuild, isPreview } = conditionalConfig;
    console.log('当前执行的命令:',command);
    console.log('当前运行环境:',mode);
    const env = loadEnv(mode, process.cwd()); // 根据 mode 来判断当前是何种环境
    let config =  {
        plugins: [
            vue(),
            VueSetupExtend(),
            createSvgIconsPlugin({
                // 指定要缓存的文件夹
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
                // 指定symbolId格式
                symbolId: 'icon-[name]'
            }),
            vitePluginBundleObfuscator(allObfuscatorConfig)
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
    }
    // development 增加sever代理
    if (mode === 'development'){
        config = {...config,server: {
                host: 'localhost',
                port: 8000,
                // 是否自动打开浏览器
                open: true,
                // 代理配置
                proxy: {
                    [env.VITE_PROXY_PRE]: {
                        target: env.VITE_API_URL,
                        changeOrigin: true,
                        rewrite: (path) => path.replace(new RegExp(`^${env.VITE_PROXY_PRE}`), '')
                    }
                }
            }}
    }
    // spring 增加base
    if (mode === 'spring'){
        config = {...config,base: env.VITE_PROXY_PRE}
    }

    return config

})


const allObfuscatorConfig = {
    // 排除不需要混淆的文件/目录
    excludes: [],
    // 总混淆开关
    enable: true,
    // 显示插件执行日志
    log: true,
    // 自动排除 node_modules • 布尔值：全部排除 • 对象：定制排除
    autoExcludeNodeModules: true,
    // autoExcludeNodeModules: { enable: true, manualChunks: ['vue'] }
    // 启用多线程混淆 • 布尔值：默认线程数 • 对象：定制线程数
    threadPool: { enable: true, size: 5 },
    // threadPool: { enable: true, size: 5 }
    options: {
        // 删除所有换行和空格
        compact: true,
        // 启用控制流扁平化
        controlFlowFlattening: true,
        // 控制流混淆比例 0-1 1=全量混淆
        controlFlowFlatteningThreshold: 1,
        // 注入无效代码干扰逆向
        deadCodeInjection: true,
        // 阻止开发者工具调试
        debugProtection: true,
        // 调试保护轮询间隔
        debugProtectionInterval: 0,
        // 禁用所有 console 输出
        disableConsoleOutput: false,
        // 变量名生成规则 `mangled`(短名称)/`hexadecimal`(十六进制)
        identifierNamesGenerator: 'hexadecimal',
        // 显示插件执行日志
        log: false,
        // 将数字转成表达式
        numbersToExpressions: true,
        // 是否重命名全局变量
        renameGlobals: true,
        // 代码自保护 (格式化/美化会触发异常)
        selfDefending: true,
        // 简化逻辑表达式
        simplify: true,
        // 拆分字符串为多段
        splitStrings: false,
        // 忽略 import/require 导入的变量
        ignoreImports: true,
        // 将字符串存入数组调用
        stringArray: true,
        // 加密字符串数组调用点
        stringArrayCallsTransform: true,
        // 调用点加密比例
        stringArrayCallsTransformThreshold: 0.5,
        // 字符串编码方式
        stringArrayEncoding: [],
        // 动态偏移字符串数组索引
        stringArrayIndexShift: true,
        // 每次调用旋转字符串数组
        stringArrayRotate: true,
        // 随机打乱字符串数组
        stringArrayShuffle: true,
        // 创建几层包装函数
        stringArrayWrappersCount: 1,
        // 包装函数链式调用
        stringArrayWrappersChainedCalls: true,
        // 包装函数最大参数数量
        stringArrayWrappersParametersMaxCount: 3,
        // 包装器存储类型 (`variable`/`function`)
        stringArrayWrappersType: 'variable',
        // 字符串存入数组的比例
        stringArrayThreshold: 0.75,
        // 使用 Unicode 转义字符串
        unicodeEscapeSequence: true,
    }
};
