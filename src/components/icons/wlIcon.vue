<template>
  <component class="icon" v-if="elIcons.includes(name)" :is="name"
             :style="{width: `${width}em` , height:`${height}em`}"/>
  <svg class="icon" v-else-if="wlIcons.includes(name)" :style="{width: `${width}em` , height:`${height}em`}"
       aria-hidden="true">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
  <span v-else>{{ name }}</span>
</template>

<script setup name="WlIcon">
import {ref} from "vue";
import {elIcons} from "@/assets/icons/el-icons.js";
import wlIcons from "@/assets/icons/wl-icons.js";

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: false,
    default: '1.2'
  }
})


const size = props.size
const width = ref(size)
const height = ref(size)

const name = props.name


</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
