import {defineStore} from 'pinia'
import router from "@/router/index.js";

export const useTagStore = defineStore('tag', {
    state: () => ({
        tagList: [],
        activeTagId: '',
        cacheMenuList: []
    }),
    getters: {},
    actions: {
        addTag(item) {
            this.activeTagId = item.meta.id
            let flag = true
            this.tagList.forEach(tag => {
                if (item.meta.id === tag.id) {
                    flag = false
                }
            })
            if (flag) {
                this.tagList.push({id: item.meta.id, title: item.meta.title, path: item.path, componentName: item.name})
                this.addCacheMenuList(item.name)
            }
        },
        deleteTag(index) {
            let item = this.tagList[index]
            if (this.activeTagId === item.id) {
                if (this.tagList.length <= 1) {
                    return
                }
                if (index === 0) {
                    // 头
                    this.activeTagId = this.tagList[1].id
                    router.push({path: this.tagList[1].path}).then(() => {
                    })
                } else if (index === this.tagList.length - 1) {
                    // 尾
                    this.activeTagId = this.tagList[this.tagList.length - 2].id
                    router.push({path: this.tagList[this.tagList.length - 2].path}).then(() => {
                    })
                } else {
                    // 其他
                    this.activeTagId = this.tagList[index + 1].id
                    router.push({path: this.tagList[index + 1].path}).then(() => {
                    })
                }
            }
            this.deleteCacheMenuList(this.tagList[index].componentName)
            this.tagList.splice(index, 1)
        },
        addCacheMenuList(name) {
            this.cacheMenuList.push(name)
        },
        deleteCacheMenuList(name) {
            let index = this.cacheMenuList.indexOf(name);
            if (index !== -1) {
                this.cacheMenuList.splice(index, 1);
            }
        }
    }
})
