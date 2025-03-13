<template>
  <el-container class="container">
    <left-menu :class="['left-menu',{'left-menu-active':menuStore.menuActive}]"></left-menu>
    <div :class="['overlay',{'overlay-active':menuStore.menuActive}]" @click="menuStore.activeMenu"></div>
    <el-container direction="vertical">
      <top-header class="top-header"></top-header>
      <top-tag class="top-tag"></top-tag>
      <app-main class="app-main"></app-main>
<!--     <bottom-footer class="bottom-footer"></bottom-footer>-->
    </el-container>
  </el-container>
</template>

<script setup>
import LeftMenu from './leftMenu/index.vue'
import TopHeader from './topHeader/index.vue'
import TopTag from './topTag/index.vue'
import AppMain from './appMain/index.vue'
import BottomFooter from './bottomFooter/index.vue'
import {useMenuStore} from "@/stores/modules/menu.js";

const menuStore = useMenuStore()


</script>

<style lang="scss" scoped>

.container {
  height: 100vh;
  width: 100vw;
  .left-menu{
    box-shadow: 5px 0 5px -5px rgba(0, 0, 0, 0.1);
  }

  .top-header {
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  }

  .app-main {
    box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.1);
    overflow: auto;
    overflow-x: hidden; /* 隐藏滚动条 */
    scrollbar-width: thin; /* 定义滚动条的宽度 */
    scrollbar-color: transparent transparent; /* 定义滚动条的颜色 */

  }

  .bottom-footer{
    //border-top: 1px solid rgba(178, 178, 178, 0.5);
    box-shadow: inset 0 2px 8px -4px rgba(0, 0, 0, 0.5); /* 向内的阴影效果 */
  }
}

@media (max-width: 768px) {
  .left-menu {
    position: fixed;
    left: -200px;
    transition: left 0.3s ease; /* 过渡效果 */

  }

  .left-menu-active {
    left: 0;
    z-index: 1002;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    display: none;
  }

  .overlay-active {
    display: block; /* 展示遮罩层 */
    z-index: 1001;
  }
  .el-main {
    padding: 5px 0px;
  }
}


</style>
