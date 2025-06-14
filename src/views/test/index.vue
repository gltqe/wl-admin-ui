<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="80px"
      >
        <el-form-item label="数据内容" prop="content">
          <el-input v-model="queryForm.content" clearable placeholder="请输入数据内容"></el-input>
        </el-form-item>
        <!--        <el-form-item label="创建人" prop="code">-->
        <!--          <el-input v-model="queryForm.code" clearable placeholder="请输入职位编码"></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="创建人" prop="code">-->
        <!--          <el-input v-model="queryForm.code" clearable placeholder="请输入职位编码"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button icon="Search" type="primary" @click="handleTableData('pageCustom')">搜索</el-button>
          <el-button icon="Refresh" type="default" @click="resetForm(queryFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="operate">
      <el-button plain size="small" icon="Plus" type="primary" @click="handleAdd">新增</el-button>
      <el-button plain size="small" icon="Edit" type="warning" @click="handleUpdate" :disabled="!isRadio">修改
      </el-button>
      <el-button plain size="small" icon="Delete" type="danger" @click="handleDelete" :disabled="!isSelect">删除
      </el-button>
      <el-button plain size="small" type="primary" @click="changeUrl('pageService')">pageService</el-button>
      <el-button plain size="small" type="primary" @click="changeUrl('pageMapper')">pageMapper</el-button>
      <el-button plain size="small" type="primary" @click="changeUrl('pageCustom')">pageCustom</el-button>
    </el-row>
    <el-row>
      <p class="tip"> 注意: pageService 和 pageMapper都是mybatis-plus中的方法 </p>
    </el-row>
    <el-table
        class="tableList"
        :data="tableData"
        v-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="数据内容" align="center" key="content" prop="content" sortable="custom"/>
      <el-table-column label="创建人" align="center" key="createName" prop="createName" sortable="custom"/>
      <el-table-column label="部门名称" align="center" key="deptName" prop="deptName" sortable="custom"/>
      <el-table-column label="所属部门" align="center" key="createDept" prop="createDept" sortable="custom"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
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
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="80px"
          :inline="true"
      >
        <el-row>
          <el-col>
            <el-form-item label="数据内容" prop="content">
              <el-input v-model="form.content" placeholder="请输入数据内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-loading="formDialog.loading" type="primary" @click="saveOrUpdate">保存</el-button>
          <el-button type="info" @click="resetForm(formRef)">重置</el-button>
          <el-button type="danger" @click="cancel">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TestInfo">
import {onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {handleResult, getCheckboxParam, getTableRadioParam} from "@/utils/commonUtil.js";
import {getTestInfoList, add, update, remove} from "@/api/test/test.js";

const loading = ref(false)
const queryForm = ref({
  currentPage: 1,
  pageSize: 10,
  isAsc: false,
  sortField: ''
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
  content: null
})
const baseForm = {...form.value}
const formRef = ref()
const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)

const url = ref('pageCustom')

const rules = ref({
  content: [
    {required: true, message: "数据内容不能为空", trigger: "blur"}
  ]
})


onMounted(() => {
  handleTableData()
})

const changeUrl = (val)=>{
  url.value = val
  handleTableData()
}

// 获取 表数据
const handleTableData = () => {
  loading.value = true
  getTestInfoList(queryForm.value, url.value).then(res => {
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

// 新增
const handleAdd = () => {
  formDialog.value.title = '新增数据'
  formDialog.value.isAdd = true
  resetForm(formRef.value)
  formDialog.value.visible = true
}
// 修改
const handleUpdate = (row) => {
  formDialog.value.title = '修改数据'
  formDialog.value.isAdd = false
  form.value.id = row.id
  form.value.content = row.content
  formDialog.value.visible = true
}

// 取消 新增或修改
const cancel = () => {
  formDialog.value.visible = false
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

// 保存或修改
const saveOrUpdate = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      if (formDialog.value.isAdd) {
        formDialog.value.loading = true
        add(form.value).then(res => {
          if (res.data.code === 200) {
            formDialog.value.visible = false
            handleTableData()
          } else {
            ElMessage.error(res.data.msg)
          }
          formDialog.value.loading = false
        })
      } else {
        formDialog.value.loading = true
        update(form.value).then(res => {
          if (res.data.code === 200) {
            formDialog.value.visible = false
            handleTableData()
          } else {
            ElMessage.error(res.data.msg)
          }
          formDialog.value.loading = false
        })
      }
    }
  })
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
.tip {
  font-size: 16px;
  color: red
}

</style>
