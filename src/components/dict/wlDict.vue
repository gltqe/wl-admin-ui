<template>
  <el-tag v-if="data &&　(data.tagEffect || data.tagType)" :effect="data.tagEffect ? data.tagEffect:'light'"
          :type="data.tagType && data.tagType!=='primary'? data.tagType:'primary'">{{ data ? data.text :'' }}
  </el-tag>
  <span v-else>{{ data ? data.text :'' }}</span>
</template>

<script setup name="WlDict">
import {ref, watch} from "vue";

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  value: {
    type: String
  },
  dataMap: {
    type: Object,
    default: {},
    required: true
  }
})

const data = ref(props.dataMap[props.value])
watch(
    () => props.value,
    (newMatched, oldMatched) => {
      if (newMatched) {
        data.value = props.dataMap[newMatched]
      }
    }
)

</script>

<style scoped>

</style>
