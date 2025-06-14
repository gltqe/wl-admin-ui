import {defineStore} from 'pinia'
import {getUserInfo} from "@/api/system/user.js";
import {ElMessage} from "element-plus";

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: {}
    }),
    getters: {},
    actions: {
        setUserInfo() {
            return new Promise((resolve, reject) => {
                getUserInfo().then(res => {
                    if (res.data.code === 200) {
                        this.userInfo = res.data.data
                        resolve(res)
                    } else {
                        ElMessage.error(res.data.msg)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        resetUser() {
            this.userInfo = {}
        }
    }
})
