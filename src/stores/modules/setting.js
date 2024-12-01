import {defineStore} from 'pinia'

export const useSettingStore = defineStore('setting', {
    state: () => ({
        menuSetting: {
            menuBackground: null,
            menuActiveTextColor: null,
            menuTextColor: null
        }
    }),
    getters: {},
    actions: {
        // getMenuBackground() {
        //     if (localStorage.getItem('menuBackground')){
        //         return localStorage.getItem('menuBackground');
        //     }else {
        //         // 跟随系统
        //         return this.menuSetting.menuBackground ? this.menuSetting.menuBackground : null
        //     }
        // },
        // getMenuActiveTextColor() {
        //     if (localStorage.getItem('menuActiveTextColor')) {
        //         return localStorage.getItem('menuActiveTextColor');
        //     } else {
        //         // 跟随系统
        //         return this.menuSetting.menuActiveTextColor ? this.menuSetting.menuActiveTextColor : null
        //     }
        // },
        // getMenuTextColor() {
        //     if (localStorage.getItem('menuTextColor')) {
        //         return localStorage.getItem('menuTextColor');
        //     } else {
        //         // 跟随系统
        //         return this.menuSetting.menuTextColor ? this.menuSetting.menuTextColor : null
        //     }
        // }

    }
})
