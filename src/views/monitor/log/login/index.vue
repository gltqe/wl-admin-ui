<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="queryForm.username" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="登录时间" prop="rangeDateTime">
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
      <el-table-column label="姓名" align="center" key="cnName" prop="cnName" sortable="custom"/>
      <el-table-column label="用户名" align="center" key="username" prop="username" sortable="custom"/>
      <el-table-column label="部门" align="center" key="deptName" prop="deptName" />
      <el-table-column label="IP地址" align="center" key="ip" prop="ip" sortable="custom"/>
      <el-table-column label="浏览器" align="center" key="browser" prop="browser" sortable="custom"/>
      <el-table-column label="操作系统" align="center" key="os" prop="os" sortable="custom"/>
      <el-table-column label="登录时间" align="center" key="time" prop="time" sortable="custom"/>
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
        destroy-on-close
    >
      <el-descriptions  border>
        <el-descriptions-item label="姓名">{{ form.cnName }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ form.username }}</el-descriptions-item>
        <el-descriptions-item label="登录时间">{{ form.time }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ form.deptName }}</el-descriptions-item>
        <el-descriptions-item label="ip">{{ form.ip }}</el-descriptions-item>
        <el-descriptions-item label="浏览器">{{ form.browser }}</el-descriptions-item>
        <el-descriptions-item label="系统">{{ form.os }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="LoginLog">
import {onMounted, ref} from "vue";
import {getLoginLogPage, getOne, remove} from "@/api/monitor/loginLog.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {handleResult, getCheckboxParam, getTableRadioParam,getDateTimeOfRange} from "@/utils/commonUtil.js";

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
  cnName: null,
  username: null,
  deptName: null,
  ip: null,
  browser: null,
  os: null,
  time: null,
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
  getLoginLogPage(queryForm.value).then(res => {
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
    formDialog.value.visible = true
    form.value = res.data.data
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
const handleDelete = (row) => {
  ElMessageBox.confirm('删除后无法找回,是否确定要删除选中的数据?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const ids = getCheckboxParam(row, selectData.value, 'id')
    remove(ids).then(res => {
      handleResult(res)
      handleTableData()
    })
  }).catch(() => {

  })
}
</script>

<style scoped>

</style>
