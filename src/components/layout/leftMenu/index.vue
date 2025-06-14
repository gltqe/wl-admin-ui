<template>
  <el-aside
      :class="['left-aside',{'left-aside-expand':!menuStore.menuCollapse},{'left-aside-collapse':menuStore.menuCollapse}]">
    <el-scrollbar class="scrollbar">
      <el-menu
          :collapse="menuStore.menuCollapse"
          :collapse-transition="false"
          class="menu"
          :default-active="menuStore.defaultActiveMenuId"
      >
        <router-link to="/">
          <div class="left-menu-head">
            <!--          <el-image class="logo" :src="logo"></el-image>-->
            <wl-icon name="logo" size="2.5"></wl-icon>
            <div class="logo-div" v-if="!menuStore.menuCollapse"><span class="logo-text">wl-admin</span></div>
          </div>
        </router-link>
        <sub-menu
            v-for="(menu,index) in menuList"
            v-if="menuList && menuList.length>0"
            :key="index"
            :menu="menu"
        >
        </sub-menu>
      </el-menu>
    </el-scrollbar>
  </el-aside>

</template>

<script setup>
import {useMenuStore} from "@/stores/modules/menu.js";
import SubMenu from '@/components/layout/subMenu/index.vue'
import {useRoute} from "vue-router";
import {useTagStore} from "@/stores/modules/tag.js";
import WlIcon from "@/components/icons/wlIcon.vue";
import {onMounted, ref} from "vue";
import {useSettingStore} from "@/stores/modules/setting.js";

const menuStore = useMenuStore()
const tagStore = useTagStore()
const settingStore = useSettingStore()
const menuList = menuStore.menuList
// todo 改为可配置

// const menuBackground = ref(settingStore.getMenuBackground())
// const menuActiveTextColor = ref(settingStore.getMenuActiveTextColor())
// const menuTextColor = ref(settingStore.getMenuTextColor())

const route = useRoute()
menuStore.defaultActiveMenuId = route.meta.id
tagStore.addTag(route)
</script>

<style lang="scss" scoped>
$menu-width:200px;
$menu-width-collapse:64px;

:export {
  //menuBackground:$menu-background;
  menuWidth:$menu-width;
  menuWidthCollapse:$menu-width-collapse;
}

.scrollbar {
  //background: v-bind('menuBackground');
  background-color: var(--el-menu-bg-color);
}

.left-aside {
  height: 100vh;
  z-index: 1002;
  border-right: 1px rgba(168, 168, 168, 0.2) solid;
  overflow: hidden;
  background-color: var(--el-menu-bg-color);
  // 去掉router-link下划线
  a {
    text-decoration: none;
  }

  .left-menu-head {
    padding: 20px 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    .logo {
      width: 42px;
      height: 42px;
    }

    .logo-div {
      padding: 0 10px;

      .logo-text {
        font-size: large;
        white-space: nowrap;
        color: var(--el-menu-text-color);
      }
    }
  }
}

.left-aside-expand {
  width: $menu-width;
  transition: width 0.5s;
}

.left-aside-collapse {
  width: $menu-width-collapse;
  transition: width 0.3s;
}

.menu {
  height: 100%;
  border-right: none;
  overflow: hidden; /* 改为 el-scrollbar 禁用滚动条 */
  //overflow-x: hidden; /* 隐藏滚动条 */
  scrollbar-width: thin; /* 定义滚动条的宽度 */
  scrollbar-color: transparent transparent; /* 定义滚动条的颜色 */
}

.menu::-webkit-scrollbar {
  width: 8px; /* 定义滚动条宽度 */
  background-color: v-bind('menuBackground'); /* 滚动条背景颜色 */
}

.menu::-webkit-scrollbar-thumb {
  background-color: transparent; /* 滚动条滑块颜色 */
  border-radius: 4px; /* 滚动条滑块圆角 */
}

.menu::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3); /* 鼠标悬停时滚动条滑块颜色 */
}
</style>
