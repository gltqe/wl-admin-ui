<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="60px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="queryForm.name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="queryForm.code" clearable placeholder="请输入字典编码"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <wl-select v-model="queryForm.status" @change="handleTableData" placeholder="请选择状态"
                     dict-code="sys_status" clearable></wl-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" type="primary" @click="handleTableData">搜索</el-button>
          <el-button icon="Refresh" type="default" @click="resetForm(queryFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="operate">
      <el-button plain size="small" icon="Plus" type="primary" v-permission="'dict:list:add'" @click="handleAdd">新增</el-button>
      <el-button plain size="small" icon="Edit" type="warning" v-permission="'dict:list:update'" @click="handleUpdate" :disabled="!isRadio">修改</el-button>
      <el-button plain size="small" icon="Delete" type="danger" v-permission="'dict:list:remove'" @click="handleDelete" :disabled="!isSelect">删除</el-button>
      <el-button plain size="small" icon="Upload" type="info" v-permission="'dict:list:import'">导入</el-button>
      <el-button plain size="small" icon="Download" type="success" v-permission="'dict:list:export'">导出</el-button>
      <el-button plain size="small" icon="Delete" type="danger" v-permission="'dict:list:refresh'" @click="handleRefresh">刷新缓存</el-button>

    </el-row>

    <el-table
        class="tableList"
        :data="tableData"
        v-wl-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="名称" align="center" key="name" prop="name" sortable="custom"/>
      <el-table-column label="编码" align="center" key="code" prop="code" sortable="custom">
        <template #default="scope">
          <router-link :to="'/dictItem/' + scope.row.code+'/'+scope.row.name">
            <span>{{ scope.row.code }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" key="status" prop="status" sortable="custom">
        <template #default="scope">
          <wl-dict  :data-map="sys_status" :value="scope.row.status"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" v-permission="'dict:list:update'" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" v-permission="'dict:list:remove'" @click="handleDelete(scope.row)">删除</el-button>
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
          <el-col >
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入字典名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col >
            <el-form-item label="编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入字典编码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="状态" prop="status">
              <wl-radio v-model="form.status" dict-code="sys_status" placeholder="请选择状态"></wl-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col >
            <el-form-item label="备注" prop="remarks">
              <el-input class="dialog-row-input" v-model="form.remarks" :maxlength="200" show-word-limit type="textarea"
                        placeholder="请输入备注"/>
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

<script setup name="DictInfo">
import {onMounted, ref} from "vue";
import {page, getOne, remove, add, update,refresh} from "@/api/system/dict.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {handleResult, getCheckboxParam, getTableRadioParam, getDictMap} from "@/utils/commonUtil.js";
import WlSelect from "@/components/select/wlSelect.vue";
import WlDict from "@/components/dict/wlDict.vue";

const {sys_status} = getDictMap('sys_status')

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
  name: null,
  code: null,
  status: null,
  remarks: null
})
const baseForm = {...form.value}
const formRef = ref()
const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)

const rules = ref({
  name: [
    {required: true, message: "字典名称不能为空", trigger: "blur"}
  ],
  code: [
    {required: true, message: "字典编码不能为空", trigger: "blur"}
  ],
})


onMounted(() => {
  handleTableData()
})

// 获取 表数据
const handleTableData = () => {
  loading.value = true
  page(queryForm.value).then(res => {
    if (res.data.code === 200) {
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
// 修改分页size字典
const handleSizeChange = (number) => {

}
// 修改分页currentPage字典
const handleCurrentChange = (number) => {

}

// 新增
const handleAdd = () => {
  formDialog.value.title = '新增字典'
  formDialog.value.isAdd = true
  resetForm(formRef.value)
  formDialog.value.visible = true
}
// 修改
const handleUpdate = (row) => {
  formDialog.value.title = '修改字典'
  formDialog.value.isAdd = false
  const id = getTableRadioParam(row, selectData.value, 'id')
  getOne({id: id}).then(res => {
    formDialog.value.visible = true
    form.value = res.data.data
  })
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
    const ids = getCheckboxParam(row, selectData.value, 'code')
    remove(ids).then(res => {
      handleResult(res)
      handleTableData()
    })
  }).catch(() => {

  })
}
// 刷新缓存
const handleRefresh =()=>{
  refresh().then(res=>{
    handleResult(res)
  })
}

</script>

<style lang="scss" scoped>

</style>
