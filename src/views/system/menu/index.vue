<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="80px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="queryForm.name" clearable placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <wl-select v-model="queryForm.type" @change="handleTableData" placeholder="请选择菜单类型"
                     dict-code="menu_type" clearable></wl-select>
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
      <el-button plain size="small" icon="Plus" type="primary" v-permission="'menu:list:add'" @click="handleAdd">新增</el-button>
      <el-button plain size="small" icon="Edit" type="warning" v-permission="'menu:list:update'" @click="handleUpdate" :disabled="!isRadio">修改
      </el-button>
      <el-button plain size="small" icon="Delete" type="danger" v-permission="'menu:list:remove'" @click="handleDelete" :disabled="!isSelect">删除
      </el-button>
      <el-button plain size="small" icon="Expand" type="info" @click="handleExpandAll">展开/折叠</el-button>
    </el-row>

    <el-table
        v-if="refreshTable"
        class="tableList"
        ref="tableRef"
        :data="tableData"
        v-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
        row-key="id"
        :indent="32"
        :default-expand-all="expandAll"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="菜单名称" align="center" key="name" prop="name" width="200"/>
      <el-table-column label="图标" align="center" key="iconType" prop="iconType">
        <template #default="{ row }">
          <wl-icon v-if="row.type!=='2'" :name="row.iconType" size="1.2"></wl-icon>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" key="sort" prop="sort"/>
      <el-table-column label="菜单类型" align="center" key="type" prop="type">
        <template #default="scope">
          <wl-dict :data-map="menu_type" :value="scope.row.type"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="权限标识" align="center" key="permission" prop="permission"/>
      <el-table-column label="组件" align="center" key="component" prop="component"/>
      <el-table-column label="状态" align="center" key="status" prop="status">
        <template #default="scope">
          <wl-dict :data-map="sys_status" :value="scope.row.status"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" v-permission="'menu:list:update'" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" v-permission="'menu:list:remove'" @click="handleDelete(scope.row)">删除</el-button>
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
          label-width="100"
          :inline="true"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型" prop="type">
              <wl-radio v-model="form.type" dict-code="menu_type"></wl-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上级菜单" prop="parentId">
              <el-tree-select
                  class="menu-tree"
                  v-model="form.parentId"
                  filterable
                  :filter-node-method="filterNodeMethod"
                  :data="menuTree"
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
              <el-input v-model="form.name" placeholder="请输入菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <wl-radio v-model="form.status" dict-code="sys_status"></wl-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" v-if="form.type==='1'">
            <el-form-item label="组件名称" prop="componentName">
              <template #label>
                  <span>组件名称
                    <el-tooltip placement="top-start" content="创建组件时的name属性，例如：MenuInfo"><el-icon><QuestionFilled/></el-icon></el-tooltip>
                  </span>
              </template>
              <el-input v-model="form.componentName" placeholder="请输入组件名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.type==='1'">
            <el-form-item label="组件路径" prop="component">
              <template #label>
                  <span>组件路径
                    <el-tooltip placement="top-start" content="组件所在路径，例如：/system/menu/index"><el-icon><QuestionFilled/></el-icon></el-tooltip>
                  </span>
              </template>
              <el-input v-model="form.component" placeholder="请输入组件路径"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.type==='1'||form.type==='2'">
            <el-form-item label="权限标识" prop="permission">
              <template #label>
                  <span>权限标识
                    <el-tooltip placement="top-start" content="例如：user:list:query"><el-icon><QuestionFilled/></el-icon></el-tooltip>
                  </span>
              </template>
              <el-input v-model="form.permission" placeholder="请输入权限标识"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8" v-if="form.type!=='2'">
            <el-form-item label="路由" prop="path">
              <template #label>
                  <span>路由
                    <el-tooltip placement="top-start" content="以'/'开头，例如：/system"><el-icon><QuestionFilled/></el-icon></el-tooltip>
                  </span>
              </template>
              <el-input v-model="form.path" placeholder="请输入菜单路由"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.type!=='2'">
            <el-form-item label="图标" prop="iconType">
              <template #label>
                  <span>图标
                    <el-tooltip placement="top-start"
                                content="输入element官网图标名称 或 ‘src/assets/icons/svg’下svg文件名称"><el-icon><QuestionFilled/></el-icon></el-tooltip>
                  </span>
              </template>
              <el-input v-model="form.iconType" placeholder="请输入图标"/>
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

<script setup name="MenuInfo">
import {nextTick, onMounted, ref} from "vue";
import {getMenuByUser, getOne, remove, add, update} from "@/api/system/menu.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {handleResult, getCheckboxParam, getTableRadioParam, getDictMap} from "@/utils/commonUtil.js";
import WlIcon from "@/components/icons/wlIcon.vue";

const {sys_status, menu_type} = getDictMap('sys_status', 'menu_type')
const loading = ref(false)
const queryForm = ref({
  currentPage: 1,
  pageSize: 10,
  isAsc: false,
  sortField: ''
})
const queryFormRef = ref()

const menuTree = ref([])
const menuTreeRef = ref()

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
  type: '',
  parentId: '',
  name: '',
  path: '',
  component: '',
  componentName: '',
  permission: '',
  sort: 0,
  status: '',
  iconType: ''
})
const baseForm = {...form.value}
const formRef = ref()
const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)


const rules = ref({
  type: [
    {required: true, message: '菜单类型不能为空', trigger: 'blur'}
  ],
  parentId: [
    {required: true, message: '上级菜单不能为空', trigger: 'blur'}
  ],
  name: [
    {required: true, message: "菜单名称不能为空", trigger: "blur"}
  ],
  path: [
    {required: true, message: '请输入路由(以"/"开头,例如:/system)', trigger: 'blur'}
  ],
  component: [
    {required: true, message: '请输入组件路径(例如: /system/menu/index)', trigger: 'blur'}
  ],
  componentName: [
    {required: true, message: '请输入组件名称(创建组件时的name属性)', trigger: 'blur'}
  ],
  // permission: [
  //   {required: true, message: '请输入权限标识', trigger: 'blur'}
  // ],
  iconType: [
    {required: true, message: '请输入标志(参考element官网)', trigger: 'blur'}
  ]

})


onMounted(() => {
  handleTableData()
})

// 获取 表数据
const handleTableData = () => {
  loading.value = true
  getMenuByUser(queryForm.value).then(res => {
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
//   console.log(row)
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
// 上级菜单筛选
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
  formDialog.value.title = '新增菜单'
  formDialog.value.isAdd = true
  resetForm(formRef.value)
  await handleMenuList()
  formDialog.value.visible = true
}
// 修改
const handleUpdate = async (row) => {
  formDialog.value.title = '修改菜单'
  formDialog.value.isAdd = false
  await handleMenuList()
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

// 获取菜单
const handleMenuList = () => {
  // getMenuByUser().then(res => {
  //   if (res.data.code == 200) {
  //     menuTree.value = res.data.data
  //   } else {
  //     ElMessage.error(res.data.msg)
  //   }
  // })
  menuTree.value = [{id: '0', name: '主菜单', children: tableData.value}]
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
.menu-tree {
  width: 220px;
}

.wl-radio {
  width: 300px;
}

.icon-column {
  height: 1.2em;
  width: 1.2em;
}
</style>
