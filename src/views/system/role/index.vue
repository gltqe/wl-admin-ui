<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="80px"

      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="queryForm.name" clearable placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="queryForm.code" clearable placeholder="请输入角色编码"></el-input>
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
      <el-button plain size="small" icon="Plus" type="primary" v-permission="'role:list:add'" @click="handleAdd">新增
      </el-button>
      <el-button plain size="small" icon="Edit" type="warning" v-permission="'role:list:update'" @click="handleUpdate"
                 :disabled="!isRadio">修改
      </el-button>
      <el-button plain size="small" icon="Delete" type="danger" v-permission="'role:list:remove'" @click="handleDelete"
                 :disabled="!isSelect">删除
      </el-button>
      <el-button plain size="small" icon="Upload" type="info" v-permission="'role:list:import'">导入</el-button>
    </el-row>

    <el-table
        class="tableList"
        :data="tableData"
        v-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="角色名称" align="center" key="name" prop="name" sortable="custom"/>
      <el-table-column label="角色编码" align="center" key="code" prop="code" sortable="custom"/>
      <el-table-column label="角色状态" align="center" key="status" prop="status" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="sys_status" :value="scope.row.status"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" key="createTime" prop="createTime" sortable="custom"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" v-permission="'role:list:update'" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" v-permission="'role:list:remove'"
                     @click="handleDelete(scope.row)">删除
          </el-button>
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
          <el-col :span="8">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入角色编码"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <wl-radio v-model="form.status" dict-code="sys_status"></wl-radio>
              <!--              <wl-select v-model="form.status" placeholder="请选择状态" dict-code="sys_status" clearable></wl-select>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="数据权限" prop="dataScope">
              <wl-select v-model="form.dataScope" placeholder="请选择数据权限" dict-code="data_scope"
                         clearable></wl-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" :maxlength="200" show-word-limit type="textarea"
                        placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单权限" prop="menuIds" class="permission-tree">
              <div>
                <el-checkbox v-model="menuAllChecked" @change="handleMenuAllChecked" label="全选"/>
                <el-checkbox v-model="menuExpand" @change="handleMenuExpand" label="展开/折叠"/>
                <el-checkbox v-model="menuCheckStrictly" label="联动"/>
                <el-checkbox v-model="menuAccordion" label="手风琴"/>
              </div>

              <el-divider/>
              <el-tree
                  class="tree"
                  ref="menuTreeRef"
                  :data="menuTree"
                  v-model="form.menuIds"
                  show-checkbox
                  :check-strictly="!menuCheckStrictly"
                  :accordion="menuAccordion"
                  node-key="id"
                  highlight-current
                  :props="{label:'name',children:'children'}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.dataScope==='4'">
            <el-form-item label="部门权限" prop="deptIds" class="permission-tree">
              <div>
                <el-checkbox v-model="deptAllChecked" @change="handleDeptAllChecked" label="全选"/>
                <el-checkbox v-model="deptExpand" @change="handleDeptExpand" label="展开/折叠"/>
                <el-checkbox v-model="deptCheckStrictly" label="联动"/>
                <el-checkbox v-model="deptAccordion" label="手风琴"/>
              </div>
              <el-divider/>
              <el-tree
                  class="tree"
                  ref="deptTreeRef"
                  :data="deptTree"
                  v-model="form.deptIds"
                  show-checkbox
                  :check-strictly="!deptCheckStrictly"
                  :accordion="deptAccordion"
                  node-key="id"
                  highlight-current
                  :props="{label:'name',children:'children'}"
              />
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

<script setup name="RoleInfo">
import {nextTick, onMounted, ref} from "vue";
import {getDeptByUser} from "@/api/system/dept.js";
import {add, getOne, page, remove, update} from "@/api/system/role.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {getCheckboxParam, getDictMap, getTableRadioParam, handleResult} from "@/utils/commonUtil.js";
import {getMenuByUser} from "@/api/system/menu.js";

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
const deptCheckStrictly = ref(true)
const deptAccordion = ref(false)
const deptExpand = ref(true)
const deptAllChecked = ref(false)

const menuTree = ref([])
const menuTreeRef = ref()
const menuCheckStrictly = ref(true)
const menuAccordion = ref(false)
const menuExpand = ref(true)
const menuAllChecked = ref(false)


const tableData = ref([])
const total = ref(0)
const formDialog = ref({
  visible: false,
  isAdd: true,
  title: '',
  loading: false
})
const form = ref({
  name: '',
  code: '',
  status: '',
  dataScope: '',
  sort: 0,
  remarks: '',
  deptIds: [],
  menuIds: []
})
const baseForm = {...form.value}
const formRef = ref()
const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)

const rules = ref({
  name: [
    {required: true, message: "角色名称不能为空", trigger: "blur"}
  ],
  code: [
    {required: true, message: "角色编码不能为空", trigger: "blur"}
  ]
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

// 新增
const handleAdd = async () => {
  formDialog.value.title = '新增角色'
  formDialog.value.isAdd = true
  await handleDeptList()
  await handleMenuList()
  resetForm(formRef.value)
  formDialog.value.visible = true
  await nextTick(() => {
    if (menuExpand.value) {
      handleMenuExpand()
    }
    if (menuExpand.value) {
      handleDeptExpand()
    }
  })
}
// 修改
const handleUpdate = async (row) => {
  formDialog.value.title = '修改角色'
  formDialog.value.isAdd = false
  await handleDeptList()
  await handleMenuList()
  const id = getTableRadioParam(row, selectData.value, 'id')
  await getOne({id: id}).then(res => {
    if (res.data.code === 200) {
      form.value = res.data.data
      formDialog.value.visible = true
    } else {
      ElMessage.error(res.data.msg)
    }
  }).then(() => {
    nextTick(() => {
      if (menuExpand.value) {
        handleMenuExpand()
      }
      if (menuExpand.value) {
        handleDeptExpand()
      }
      form.value.deptIds.forEach(item => {
        deptTreeRef.value.setChecked(item, true, false)
      })
      form.value.menuIds.forEach(item => {
        menuTreeRef.value.setChecked(item, true, false)
      })
    })
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
  if (formEl === formRef.value) {
    form.value = {...baseForm}
    if (menuTreeRef.value) {
      menuTreeRef.value.setCheckedNodes([])
    }
    if (deptTreeRef.value) {
      deptTreeRef.value.setCheckedNodes([])
    }
  }
  if (formEl === queryFormRef.value) {
    handleTableData()
  }
  if (!formEl) return
  formEl.resetFields()

}


// 获取菜单
const handleMenuList = async () => {
  await getMenuByUser({}).then(res => {
    if (res.data.code === 200) {
      menuTree.value = res.data.data
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

// 获取部门
const handleDeptList = async () => {
  await getDeptByUser({}).then(res => {
    if (res.data.code === 200) {
      deptTree.value = res.data.data
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}
// 获取所有选中的菜单id
const getMenuChecked = () => {
  const checkedKeys = menuTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
// 控制菜单全选
const handleMenuAllChecked = () => {
  menuTreeRef.value.setCheckedNodes(menuAllChecked.value ? menuTree.value : [])
}
// 控制菜单展开或折叠
const handleMenuExpand = () => {
  if (menuTreeRef.value) {
    for (let i = 0; i < menuTree.value.length; i++) {
      menuTreeRef.value.getNode(menuTree.value[i].id).expanded = menuExpand.value
    }
  }
}
// 获取所有选中的部门id
const getDeptChecked = () => {
  if (deptTreeRef.value) {
    const checkedKeys = deptTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = deptTreeRef.value.getHalfCheckedKeys()
    checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
    return checkedKeys
  } else {
    return []
  }
}
// 控制菜单全选
const handleDeptAllChecked = () => {
  deptTreeRef.value.setCheckedNodes(deptAllChecked.value ? deptTree.value : [])
}
// 控制菜单展开或折叠
const handleDeptExpand = () => {
  if (deptTreeRef.value) {
    for (let i = 0; i < deptTree.value.length; i++) {
      deptTreeRef.value.getNode(deptTree.value[i].id).expanded = deptExpand.value
    }
  }

}

// 保存或修改
const saveOrUpdate = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      formDialog.value.loading = true
      form.value.menuIds = getMenuChecked()
      form.value.deptIds = getDeptChecked()
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
<style lang="scss" scoped>
.permission-tree {
  :deep(.el-form-item__content) {
    padding: 10px 20px;
    width: 100%;
    border: #c3c2c2 1px solid;
  }

  :deep(.el-checkbox) {
    margin-right: 15px;
  }

  .el-divider--horizontal {
    margin: 5px 0px;
  }
}


</style>
