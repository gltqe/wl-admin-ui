<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="80px"
      >
        <el-form-item label="任务名" prop="taskName">
          <el-input v-model="queryForm.taskName" clearable placeholder="请输入任务名"></el-input>
        </el-form-item>
        <el-form-item label="日志时间" prop="rangeDateTime">
          <el-date-picker
              v-model="queryForm.rangeDateTime"
              unlink-panels
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="defaultTime"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" type="primary" @click="handleTableData">搜索</el-button>
          <el-button icon="Refresh" type="default" @click="resetForm(queryFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="operate">
      <el-button plain size="small" icon="Download" type="success">导出</el-button>
    </el-row>

    <el-table
        class="tableList"
        :data="tableData"
        v-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="任务名称" align="center" key="taskName" prop="taskName" sortable="custom"/>
      <el-table-column label="任务分组" align="center" key="taskGroup" prop="taskGroup" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="task_group" :value="scope.row.taskGroup"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="类名" align="center" key="beanName" prop="beanName" sortable="custom"/>
      <el-table-column label="方法名" align="center" key="methodName" prop="methodName" sortable="custom"/>
      <el-table-column label="耗时（毫秒）" align="center" key="consumeTime" prop="consumeTime" sortable="custom"/>
      <el-table-column label="执行结果" align="center" key="resultStatus" prop="resultStatus" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="task_result_status" :value="scope.row.resultStatus"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="日志时间" align="center" key="createTime" prop="createTime" sortable="custom"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleSelect(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        class="table-pagination"
        v-model:current-page="queryForm.currentPage"
        v-model:page-size="queryForm.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :small="false"
        :disabled="false"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @change="handleTableData"
    />

    <el-dialog
        ref="formDialogRef"
        v-model="formDialog.visible"
        :title="formDialog.title"
        width="1000"
        :before-close="handleCloseDialog"
    >
      <el-descriptions :column="3">
        <el-descriptions-item label-class-name="des-label" label="任务名称：">{{ form.taskName }}</el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="任务分组：">
          <wl-dict :data-map="task_group" :value="form.taskGroup"></wl-dict>
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="执行结果：">
          <wl-dict :data-map="task_result_status" :value="form.resultStatus"></wl-dict>
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="类名：">{{ form.beanName }}</el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="方法名：">{{ form.methodName }}</el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="日志时间：">{{
            form.createTime
          }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="开始时间：">{{
            form.startDateTime
          }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="结束时间：">{{
            form.endDateTime
          }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="耗时（毫秒）：">{{
            form.consumeTime
          }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" :span="3" label="参数：">{{
            form.params
          }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" :span="3" label="错误信息：">{{
            form.errorMsg
          }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="ScheduleLog">
import {onMounted, ref} from "vue";
import {getScheduleLogList, getOne} from "@/api/monitor/scheduleLog.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  getTableRadioParam,
  getDateTimeOfRange,
  getDictMap
} from "@/utils/commonUtil.js";
import {useRoute} from "vue-router";

const {task_group, task_result_status} = getDictMap('task_group', 'task_result_status')

const defaultTime = [
  new Date(2000, 1, 1, 12, 0, 0),
  new Date(2000, 2, 1, 8, 0, 0),
]

const loading = ref(false)
const queryForm = ref({
  taskId: null,
  taskName: null,
  rangeDateTime: [],
  startDateTime: null,
  endDateTime: null,
  currentPage: 1,
  pageSize: 10,
  isAsc: false,
  sortField: null
})
const queryFormRef = ref()
const tableData = ref([])
const total = ref(0)
const formDialog = ref({
  visible: false,
  isAdd: true,
  title: '',
  loading: false
})
const form = ref({
  taskName: null,
  taskGroup: null,
  beanName: null,
  methodName: null,
  params: null,
  resultStatus: null,
  startDateTime: null,
  endDateTime: null,
  consumeTime: null,
  errorMsg: null,
  createTime: null
})
const baseForm = {...form.value}
const formRef = ref()
const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)

const route = useRoute()


const getRouteParams = ()=>{
  if (route.query) {
    if (route.query.taskName) {
      queryForm.value.taskName = route.query.taskName
    }
    if (route.query.taskId) {
      queryForm.value.taskId = route.query.taskId
    }
  }
}



onMounted(() => {
  getRouteParams()
  handleTableData()
})

// 获取 表数据
const handleTableData = () => {
  loading.value = true
  console.log('queryForm.value')
  console.log(queryForm.value)
  getDateTimeOfRange(queryForm.value)
  getScheduleLogList(queryForm.value).then(res => {
    if (res.data.code == 200) {
      tableData.value = res.data.data.records
      total.value = res.data.data.total
    } else {
      ElMessage.error(res.data.msg)
    }
    loading.value = false
  })
}
// 表 当前选中的数据
const selectionChange = (selection) => {
  selectData.value = selection
  isRadio.value = selection.length === 1;
  isSelect.value = selection.length > 0
}

const sortChange = ({column, prop, order}) => {
  queryForm.value.sortField = prop
  queryForm.value.isAsc = order === 'ascending'
  handleTableData()
}
// 修改分页size参数
const handleSizeChange = (number) => {

}
// 修改分页currentPage参数
const handleCurrentChange = (number) => {

}

// 详情
const handleSelect = (row) => {
  formDialog.value.title = '登录详情'
  formDialog.value.isAdd = false
  const id = getTableRadioParam(row, selectData.value, 'id')
  getOne({id: id}).then(res => {
    if (res.data.code === 200) {
      form.value = res.data.data
      formDialog.value.visible = true
    } else {
      ElMessage.error(res.data.msg)
    }

  })
}

// 关闭弹窗
const handleCloseDialog = (done) => {
  resetForm(formRef.value)
  done()
}

// 重置 form
const resetForm = (formEl) => {
  form.value = {...baseForm}
  if (!formEl) return
  formEl.resetFields()
  if (formEl === queryFormRef.value) {
    handleTableData()
  }
}


// 删除
// const handleDelete = (row) => {
//   ElMessageBox.confirm('删除后无法找回,是否确定要删除选中的数据?', '警告', {
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//     type: 'warning',
//   }).then(() => {
//     const ids = getCheckboxParam(row, selectData.value, 'id')
//     remove(ids).then(res => {
//       handleResult(res)
//       handleTableData()
//     })
//   }).catch(() => {
//
//   })
// }
</script>

<style lang="scss" scoped>

:deep(.el-descriptions__body) {
  .el-descriptions__table.is-bordered .el-descriptions__cell {
    padding: 30px 11px;
    min-width: 120px;
    max-width: 500px;
    word-break: break-all; // 让内容超出列宽时自动换行显示
    word-wrap: break-word;
  }
}
</style>
