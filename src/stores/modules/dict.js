import {defineStore} from 'pinia'

export const useDictStore = defineStore('dict', {
    state: () => ({
        cacheDictMap: {}
    }),
    getters: {},
    actions: {
        addCache(dictCode, dictMap) {
            this.cacheDictMap[dictCode] = dictMap
        },
        getCache(dictCode){
            return  this.cacheDictMap[dictCode]
        }
    }
})
