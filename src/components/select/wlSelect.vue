<template>
  <el-select class="wl-select" v-bind="$attrs">
    <el-option
        v-for="(item,index) in data"
        :key="index"
        :value="item[valueStr]"
        :label="item[labelStr]"
    ></el-option>
  </el-select>
</template>

<script setup name="WlSelect">
import {ref} from "vue";
import {getDict} from "@/api/system/dict.js";
import {ElMessage} from "element-plus";
import {useDictStore} from "@/stores/modules/dict.js";

defineOptions({
  inheritAttrs: false
})


const props = defineProps({
  dictCode: {
    type: String,
    default: ''
  },
  dictType: {
    type: Number,
    default: 0
  },
  dataList: {
    type: Array,
    default: []
  },
  dataMethod: {
    type: Function
  },
  valueStr: {
    type: String,
    default: 'value'
  },
  labelStr: {
    type: String,
    default: 'text'
  }
})

// 优先级最低
const data = ref(props.dataList)

if (props.dataMethod) {
  props.dataMethod().then(result => {
    if (result instanceof Array) {
      data.value = result
    }
  })
}

if (props.dictCode && props.dictCode !== '') {
  const dictCodeKey = props.dictCode + '_list'
  const dict = useDictStore().getCache(dictCodeKey);
  if (dict) {
    data.value = dict
  } else {
    getDict({code: props.dictCode, type: 0}).then(res => {
      if (res.data.code === 200) {
        data.value = res.data.data.list
        useDictStore().addCache(dictCodeKey, res.data.data.list)
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  }
}


</script>

<style scoped>
.wl-select {
  width: 200px;
}

</style>
