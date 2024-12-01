<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="80px"
      >
        <el-form-item label="用户名" prop="operator">
          <el-input v-model="queryForm.operator" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="操作时间" prop="rangeDateTime">
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
      <el-table-column label="用户名" align="center" key="operator" prop="operator" sortable="custom"/>
      <el-table-column label="操作名称" align="center" key="name" prop="name" sortable="custom"/>
      <el-table-column label="类型" align="center" key="type" prop="type" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="log_operation" :value="scope.row.type"></wl-dict>
        </template>
      </el-table-column>

      <!--      <el-table-column label="方法名" align="center" key="methodName" prop="methodName" />-->
      <el-table-column label="请求方式" align="center" key="requestType" prop="requestType" sortable="custom"/>
      <el-table-column label="请求uri" align="center" key="requestUri" prop="requestUri" sortable="custom"/>
      <el-table-column label="请求地址" align="center" key="requestIp" prop="requestIp" sortable="custom"/>
      <el-table-column label="操作时间" align="center" key="requestTime" prop="requestTime" sortable="custom"/>
      <!--      <el-table-column label="响应时间" align="center" key="responseTime" prop="responseTime" sortable="custom"/>-->
      <el-table-column label="执行时间" align="center" key="executeTime" prop="executeTime" sortable="custom"/>
      <el-table-column label="状态" align="center" key="status" prop="status" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="log_operation_status" :value="scope.row.status"></wl-dict>
        </template>
      </el-table-column>
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
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">{{ form.operator }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ form.deptName }}</el-descriptions-item>
        <el-descriptions-item label="操作名称">{{ form.name }}</el-descriptions-item>
        <el-descriptions-item label="类型">
          <template #default>
            <wl-dict :data-map="log_operation" :value="form.type"></wl-dict>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <template #default>
            <wl-dict :data-map="log_operation_status" :value="form.status"></wl-dict>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="错误信息">{{ form.errorMsg }}</el-descriptions-item>
        <el-descriptions-item label="方法名">{{ form.methodName }}</el-descriptions-item>
        <el-descriptions-item label="请求uri">{{ form.requestUri }}</el-descriptions-item>
        <el-descriptions-item label="请求方式">{{ form.requestType }}</el-descriptions-item>
        <el-descriptions-item label="请求地址">{{ form.requestIp }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ form.requestTime }}</el-descriptions-item>
        <el-descriptions-item label="响应时间">{{ form.responseTime }}</el-descriptions-item>
        <el-descriptions-item label="执行时间">{{ form.executeTime }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">{{ form.requestParams }}</el-descriptions-item>
        <el-descriptions-item label="响应结果">{{ form.responseResult }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="OperationLog">
import {onMounted, ref} from "vue";
import {getOperationPage, getOne, remove} from "@/api/monitor/operation.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  handleResult,
  getCheckboxParam,
  getTableRadioParam,
  getDateTimeOfRange,
  getDictMap
} from "@/utils/commonUtil.js";

const {log_operation, log_operation_status} = getDictMap('log_operation', 'log_operation_status')

const defaultTime = [
  new Date(2000, 1, 1, 12, 0, 0),
  new Date(2000, 2, 1, 8, 0, 0),
]

const loading = ref(false)
const queryForm = ref({
  username: null,
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
  name: null,
  type: null,
  methodName: null,
  requestType: null,
  requestUri: null,
  requestIp: null,
  requestParams: null,
  responseResult: null,
  status: null,
  errorMsg: null,
  requestTime: null,
  responseTime: null,
  executeTime: null,
  operator: null,
  deptName: null

})
const baseForm = {...form.value}
const formRef = ref()
const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)


onMounted(() => {
  handleTableData()
})

// 获取 表数据
const handleTableData = () => {
  loading.value = true
  getDateTimeOfRange(queryForm.value)
  getOperationPage(queryForm.value).then(res => {
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
    form.value = res.data.data
    formDialog.value.visible = true
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
