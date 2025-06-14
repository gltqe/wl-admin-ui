<template>
  <el-main class="main">
<!--    <el-button @click="serverInfo" v-permission="'user:list:query'">唤出菜单</el-button>-->
    <router-view v-slot="{ Component, route }">
      <transition-group name="app-component" >
        <keep-alive :include="tagStore.cacheMenuList" key="keep-alive">
          <component :is="Component" :key="route.path"/>
        </keep-alive>
      </transition-group>
    </router-view>
  </el-main>
</template>

<script setup>
import {useTagStore} from "@/stores/modules/tag.js";

const tagStore = useTagStore()

</script>

<style scoped>


/* 面包屑过渡动画 */
.app-component-enter-active {
  transition: all 0.4s;
}

.app-component-leave-active {
  transition: all 0.3s;
}

.app-component-enter-from,
.app-component-leave-active {
  opacity: 0;
  transform: translateX(-30px);
}

.app-component-leave-active {
  position: absolute;
}

</style>
