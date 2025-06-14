<template>
  <el-sub-menu v-if="menu &&　menu.type==='0'" :index="menu.id">
    <template #title>
<!--      <el-icon>-->
<!--        <component :is="menu.iconType"></component>-->
<!--      </el-icon>-->
      <wl-icon :name="menu.iconType"></wl-icon>
      <span :title="menu.name" class="menu-name">{{ menu.name }}</span>
    </template>
    <sub-menu
        v-for="(item,index) in menu.children"
        v-if="menu.children && menu.children.length>0"
        :key="index"
        :menu="item"
    ></sub-menu>
  </el-sub-menu>

  <el-menu-item v-if="menu && menu.type==='1'" :index="menu.id" @click="toPage(menu)">
<!--    <el-icon>-->
<!--      <component :is="menu.iconType"></component>-->
<!--    </el-icon>-->
    <wl-icon :name="menu.iconType"></wl-icon>
    <span :title="menu.name" class="menu-name">{{ menu.name }}</span>
  </el-menu-item>
</template>

<script setup>
import SubMenu from '@/components/layout/subMenu/index.vue'
import router from '@/router/index'
import {useMenuStore} from "@/stores/modules/menu.js";
import WlIcon from "@/components/icons/wlIcon.vue";


const menuStore = useMenuStore()

const props = defineProps({
  menu: {
    type: Object,
    required: true
  }
})
const menu = props.menu

const toPage = (menu) => {
  if (menuStore.menuActive) {
    menuStore.menuActive = false
  }
  menuStore.defaultActiveMenuId = menu.id
  router.push({path: menu.path})
}

</script>

<style lang="scss" scoped>
.menu-name {
  display: block;
  width: 100%;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
