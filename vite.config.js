import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
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
            })
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
