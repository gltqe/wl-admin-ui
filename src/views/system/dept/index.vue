<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="80px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="queryForm.name" clearable placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="部门类型" prop="type">
          <wl-select v-model="queryForm.type" @change="handleTableData" placeholder="请选择部门类型"
                     dict-code="dept_type" clearable></wl-select>
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
      <el-button plain size="small" icon="Plus" type="primary" v-permission="'dept:list:add'" @click="handleAdd">新增</el-button>
      <el-button plain size="small" icon="Edit" type="warning" v-permission="'dept:list:update'" @click="handleUpdate" :disabled="!isRadio">修改
      </el-button>
      <el-button plain size="small" icon="Delete" type="danger" v-permission="'dept:list:remove'" @click="handleDelete" :disabled="!isSelect">删除
      </el-button>
      <el-button plain size="small" icon="Expand" type="info" @click="handleExpandAll">展开/折叠</el-button>
    </el-row>

    <el-table
        v-if="refreshTable"
        class="tableList"
        ref="tableRef"
        :data="tableData"
        v-wl-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
        row-key="id"
        :indent="32"
        :default-expand-all="expandAll"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="名称" align="center" key="name" prop="name"/>
      <el-table-column label="排序" align="center" key="sort" prop="sort"/>
      <el-table-column label="负责人" align="center" key="leader" prop="leader"/>
      <el-table-column label="电话" align="center" key="phone" prop="phone"/>
      <el-table-column label="邮箱" align="center" key="email" prop="email"/>
      <el-table-column label="状态" align="center" key="status" prop="status">
        <template #default="scope">
          <wl-dict :data-map="sys_status" :value="scope.row.status"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" v-permission="'dept:list:update'" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" v-permission="'dept:list:remove'" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


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
          label-width="80"
          :inline="true"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <el-tree-select
                  class="dept-tree form-tree-select"
                  v-model="form.parentId"
                  filterable
                  :filter-node-method="filterNodeMethod"
                  :data="deptTree"
                  :props="{label:'name',children:'children'}"
                  node-key="id"
                  check-strictly
                  clearable
                  check-on-click-node
                  placeholder="请选择部门"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入部门负责人"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入部门电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入部门邮箱"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <wl-radio v-model="form.status" dict-code="sys_status"></wl-radio>
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

<script setup name="DeptInfo">

import {nextTick, onMounted, ref} from "vue";
import {getDeptByUser, getOne, remove, add, update} from "@/api/system/dept.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {handleResult, getCheckboxParam, getTableRadioParam, getDictMap} from "@/utils/commonUtil.js";

const {sys_status} = getDictMap('sys_status')

const loading = ref(false)

const queryForm = ref({
  currentPage: 1,
  pageSize: 10,
  isAsc: false,
  sortField: ''
})
const queryFormRef = ref()

const deptTree = ref([])
const deptTreeRef = ref()

const refreshTable = ref(true)
const expandAll = ref(false)
const tableRef = ref()
const tableData = ref([])
const total = ref(0)
const formDialog = ref({
  visible: false,
  isAdd: true,
  title: '',
  loading: false
})
const form = ref({
  parentId: '',
  name: '',
  leader: '',
  sort: 0,
  phone: '',
  email: '',
  status: '',
  summary: '',
})
const baseForm = {...form.value}
const formRef = ref()
const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)


const rules = ref({
  parentId: [
    {required: true, message: '上级部门不能为空', trigger: 'blur'}
  ],
  name: [
    {required: true, message: "部门名称不能为空", trigger: "blur"}
  ]
})


onMounted(() => {
  handleTableData()
})

// 获取 表数据
const handleTableData = () => {
  loading.value = true
  getDeptByUser(queryForm.value).then(res => {
    if (res.data.code === 200) {
      tableData.value = res.data.data
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
//todo 点击行展开
// const handleRowClick = (row, column, event) => {
//   console.log('点击行展开')
//   tableRef.value.toggleRowExpansion(row, true)
// }
// 字段排序
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
// 上级部门筛选
const filterNodeMethod = (value, data) => {
  if (data && data.name) {
    return data.name.includes(value)
  } else {
    return false
  }
}

const handleExpandAll = () => {
  refreshTable.value = false
  expandAll.value = !expandAll.value
  nextTick(() => {
    refreshTable.value = true;
  });
}

// 新增
const handleAdd = async () => {
  formDialog.value.title = '新增部门'
  formDialog.value.isAdd = true
  resetForm(formRef.value)
  await handleDeptList()
  formDialog.value.visible = true
}
// 修改
const handleUpdate = async (row) => {
  formDialog.value.title = '修改部门'
  formDialog.value.isAdd = false
  await handleDeptList()
  const id = getTableRadioParam(row, selectData.value, 'id')
  getOne({id: id}).then(res => {
    // handleResult(res)
    form.value = res.data.data
    formDialog.value.visible = true
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
  if (formEl === queryFormRef.value) {
    handleTableData()
  }
  if (!formEl) {
    return
  }
  formEl.resetFields()

}

// 获取部门
const handleDeptList = () => {
  // getDeptByUser().then(res => {
  //   if (res.data.code == 200) {
  //     deptTree.value = res.data.data
  //   } else {
  //     ElMessage.error(res.data.msg)
  //   }
  // })
  deptTree.value = [{id: '0', name: '根目录', children: tableData.value}]
}


// 保存或修改
const saveOrUpdate = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      formDialog.value.loading = true
      if (formDialog.value.isAdd) {
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
.dept-tree {
  width: 220px;
}
</style>
