<template>
  <el-tag :effect="data.tagEffect" :type="data.tagType">{{ data.text }}</el-tag>
</template>

<script setup name="WlTag">

const props = defineProps({
  rowData: {
    type: Object,
    required: true
  }
})
const data = props.rowData

</script>

<style scoped>

</style>
