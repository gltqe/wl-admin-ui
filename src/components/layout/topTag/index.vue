<template>
  <el-header>
    <el-tag
        v-for="(tag,index) in tags"
        :key="index"
        class="tag"
        :closable="tags.length > 1"
        :type="tagStore.activeTagId===tag.id ? 'primary':'info'"
        @close="closeTag(index)"
        @click="toPage(tag)"
    >
      {{ tag.title }}
    </el-tag>
  </el-header>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useTagStore} from "@/stores/modules/tag.js";
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import {useMenuStore} from "@/stores/modules/menu.js";

const menuStore = useMenuStore()
const tagStore = useTagStore()
const route = useRoute()

const tags = tagStore.tagList

const closeTag = (index) => {
  tagStore.deleteTag(index)
}
const toPage = (tag) => {
  menuStore.defaultActiveMenuId = tag.id
  router.push({path: tag.path})
}


watch(
    () => route.path,
    (newMatched, oldMatched) => {
      tagStore.addTag(route)
    }
)
</script>

<style lang="scss" scoped>
.el-header {
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  justify-content: left;
  align-items: center;
  height: 38px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  .tag {
    margin-right: 12px;
    cursor: pointer;
    //--el-color-primary: black;
    //--el-tag-border-color: darkgray ;
  }

  //.tag-active {
  //  --el-color-primary: black;
  //  --el-tag-border-color: darkgray ;
  //}
}
</style>
