<template>
  <el-dropdown class="dropdown" split-button type="warning" v-bind="$attrs" is-plain>
    <el-icon>
      <Download/>
    </el-icon>&nbsp;{{label}}<span v-if="showMsg">{{ msg }}</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="exportType==='0'?'Select':''" @click="handleExportType('0')">当前分页</el-dropdown-item>
        <el-dropdown-item :icon="exportType==='1'?'Select':''" @click="handleExportType('1')">查询结果（默认）</el-dropdown-item>
        <el-dropdown-item :icon="exportType==='2'?'Select':''" @click="handleExportType('2')">全部数据</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup name="WlExportButton">

import {ref} from "vue";

const props = defineProps({
  exportType: {
    type: String,
    required: true,
    default: '1'
  },
  showMsg:{
    type: Boolean,
    default: false
  },
  label:{
    type: String,
    default: '导出'
  }
})

const emits = defineEmits(['update:exportType']);

const msg = ref('')

// 更新父组件的值
if (!props.exportType){
  emits('update:exportType', '1');
}


const type = ref(props.exportType)


const handleExportType = (val) => {
  if (val==='0'){
    msg.value = '（当前分页）'
  }else if (val==='1'){
    msg.value = '（查询结果）'
  }else if (val==='2'){
    msg.value = '（全部数据）'
  }
  type.value = val
  emits('update:exportType', val);
}

</script>

<style scoped>
.dropdown {
  margin-left: 12px;
}
</style>
