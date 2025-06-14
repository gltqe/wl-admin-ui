// 引入axios
import axios from 'axios'
// 引入提示
import {ElMessage} from 'element-plus'
// 引入路由
import router from '@/router/index'
// 引入进度条
import Nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 引入退出清理方法
import {logoutClear} from "@/utils/auth.js";

import {ACCESS_HEAD, REFRESH_HEAD} from "@/common/constant.js";
import {refreshToken} from "@/api/system/login.js";

// 去掉右上角旋转加载提示
Nprogress.configure({showSpinner: false})
// 请求接口前缀
const baseUrl = import.meta.env.VITE_PROXY_PRE
// 登录接口
const loginUrl = baseUrl + 'login'
// 创建一个axios实例
const instance = axios.create()

// 设置请求超时时间  或 单个请求 在请求参数中直接添加 timeout:xxx  值为0 即永不超时
instance.defaults.timeout = 10000

// 是否正在刷新 Token
let isRefreshing = false;
// 挂起的请求队列
let requests = [];

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 如果不是登录 请求头中放入x-token
        if (config.url !== loginUrl) {
            const jwt = localStorage.getItem(ACCESS_HEAD)
            config.headers[ACCESS_HEAD] = jwt
        }
        config.url = baseUrl + config.url;
        Nprogress.start()
        return config
    },
    error => {
        console.log('axios请求拦截器error:' + error.message)
        return Promise.reject(error)
    }
)
// 响应拦截器
instance.interceptors.response.use(
    response => {
        Nprogress.done()
        if (response.data instanceof Blob) {
            return response
        }
        if (!response.data) {
            ElMessage.error('未知异常data,请联系管理员')
            return
        }
        const code = response.data.code
        const msg = response.data.msg
        if (code === 200) {
            return response
        } else if (code === 500) {
            // ElMessage.error(msg)
            return response
        } else if (code === 1000) {
            // 需要重新登录
            // 这里可以改为弹窗提示是否留在本页
            // Modal.confirm({ title: '异常提示' })
            // 调用退出方法
            logoutClear()
            router.push({path: '/login', query: {msg: msg}}).then(() => {
                ElMessage.error(msg)
            })
            return Promise.reject(new Error(msg))
        } else if (code === 1001) {
            // token过期
            let refreshData = {refreshToken: localStorage.getItem(REFRESH_HEAD)}
            if (!isRefreshing) {
                isRefreshing = true;
                return refreshToken(refreshData).then(res => {
                    if (res.data.code === 1001) {
                        router.push({path: '/login'}).then(res => {
                            ElMessage.warning('太久没有登录,请重新登录')
                        })
                    } else {
                        if (res.data.code === 200) {
                            localStorage.setItem(ACCESS_HEAD, res.data.data)
                            // 重发请求
                            response.config.url = response.config.url.replace(baseUrl, '')
                            if (requests.length > 0) {
                                // 执行挂起的请求
                                requests.forEach(cb => cb());
                                requests = [];
                            }
                            // 执行当前请求
                            return instance(response.config)
                        } else {
                            // 刷新失败
                            router.push('/login').then(res => {
                                ElMessage.warning('token异常,请重新登录')
                            })
                        }
                    }
                }).finally(() => {
                    isRefreshing = false;
                    requests = [];
                })
            } else {
                // 挂起其他请求
                return new Promise(resolve => {
                    requests.push(() => {
                        response.config.url = response.config.url.replace(baseUrl, '')
                        resolve(instance(response.config));
                    });
                });
            }
        } else if (code === 403) {
            ElMessage.error(msg)
            return Promise.reject(new Error(msg))
        } else {
            ElMessage.error(msg)
            return Promise.reject(new Error(msg))
        }
    },
    error => {
        Nprogress.done()
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求'
                    break
                case 401:
                    error.message = '请重新登录'
                    break
                case 403:
                    error.message = '拒绝访问'
                    break
                case 404:
                    error.message = '请求错误,未找到该资源'
                    break
                case 405:
                    error.message = '请求方法未允许'
                    break
                case 408:
                    error.message = '请求超时'
                    break
                case 500:
                    error.message = '服务器端出错'
                    break
                case 501:
                    error.message = '网络未实现'
                    break
                case 502:
                    error.message = '网络错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网络超时'
                    break
                case 505:
                    error.message = 'http版本不支持该请求'
                    break
                default:
                    error.message = `未知错误${error.response.status}`
            }
        } else {
            error.message = '连接到服务器失败,重新登录'
        }
        console.log('响应拦截error:' + error)
        // window.location.href = '/'
        ElMessage.error(error.message)
        return Promise.reject(error)
    }
)

export default instance
