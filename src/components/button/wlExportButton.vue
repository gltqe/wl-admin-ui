<template>
  <el-dropdown class="dropdown" split-button type="warning" v-bind="$attrs" is-plain>
    <el-icon>
      <Download/>
    </el-icon>&nbsp;{{ label }}<span v-if="showMsg">{{ msg }}</span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-if="supportType.includes('current')" :icon="exportType==='current'?'Select':''"
                          @click="handleExportType('current')">
          当前分页
        </el-dropdown-item>
        <el-dropdown-item v-if="supportType.includes('query')" :icon="exportType==='query'?'Select':''"
                          @click="handleExportType('query')">
          查询结果
        </el-dropdown-item>
        <el-dropdown-item v-if="supportType.includes('all')" :icon="exportType==='all'?'Select':''"
                          @click="handleExportType('all')">
          全部数据
        </el-dropdown-item>
        <el-dropdown-item v-if="supportType.includes('select')" :icon="exportType==='select'?'Select':''"
                          @click="handleExportType('select')">
          勾选数据
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup name="WlExportButton">

import {ref} from "vue";

const props = defineProps({
  supportType: {
    type: Array,
    required: false,
    default: () => ['current', 'query', 'all', 'select']
  },
  exportType: {
    type: String,
    required: true,
    default: 'query',
    validator(value, props) {
      return props.supportType.includes(value)
    }
  },
  showMsg: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: '导出'
  }
})

const emits = defineEmits(['update:exportType']);

const msg = ref('')

// 更新父组件的值
if (!props.exportType) {
  emits('update:exportType', 'query');
}


const type = ref(props.exportType)


const handleExportType = (val) => {
  if (val === 'current') {
    msg.value = '(当前分页)'
  } else if (val === 'query') {
    msg.value = '(查询结果)'
  } else if (val === 'all') {
    msg.value = '(全部数据)'
  } else if (val === 'select') {
    msg.value = '(勾选数据)'
  }
  type.value = val
  emits('update:exportType', val);
}

</script>

<style lang="scss" scoped>
.dropdown {
  margin-left: 12px;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: flex-end; /* 垂直居中对齐 */
}

/* 为每个下拉项添加一个占位符，除非它已经有图标 */
:deep(.el-dropdown-menu__item:not(:has(>.el-icon))::before) {
  content: '';
  display: inline-block;
  width: 1em; /* 根据你的图标宽度调整 */
  height: 1em; /* 与文本行高相同 */
  margin-right: 8px; /* 根据需要调整 */
}

/* 设置图标的样式 */
:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 8px; /* 在图标和文本之间添加一些空间 */
}

</style>
