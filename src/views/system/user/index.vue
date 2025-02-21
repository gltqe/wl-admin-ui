<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="60px"

      >
        <el-form-item label="姓名" prop="cnName">
          <el-input v-model="queryForm.cnName" clearable placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="queryForm.username" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="queryForm.phone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <wl-select v-model="queryForm.status" @change="handleTableData" placeholder="请选择状态"
                     dict-code="user_status" clearable></wl-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-tree-select
              class="dept-tree"
              v-model="queryForm.deptId"
              filterable
              :filter-node-method="filterNodeMethod"
              :data="deptTree"
              :props="{label:'name',children:'children'}"
              node-key="id"
              show-checkbox
              check-strictly
              clearable
              check-on-click-node
              placeholder="请选择部门"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" type="primary" @click="handleTableData">搜索</el-button>
          <el-button icon="Refresh" type="default" @click="resetForm(queryFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="operate">
      <el-button plain size="small" icon="Plus" type="primary" v-permission="'user:list:add'" @click="handleAdd">新增
      </el-button>
      <el-button plain size="small" icon="Edit" type="warning" v-permission="'user:list:update'" @click="handleUpdate"
                 :disabled="!isRadio">修改
      </el-button>
      <el-button plain size="small" icon="Delete" type="danger" v-permission="'user:list:remove'" @click="handleDelete"
                 :disabled="!isSelect">删除
      </el-button>
      <el-button plain size="small" icon="Upload" type="info" v-permission="'user:list:import'">导入</el-button>


      <!--      <el-button plain size="small" icon="Download" type="success" v-permission="'user:list:export'" v-loading="loading"-->
      <!--                 @click="handleExport">导出-->
      <!--      </el-button>-->

      <wl-export-button size="small" v-model:export-type="queryForm.exportType"
                        @click="handleExport"></wl-export-button>
    </el-row>

    <el-table
        class="tableList"
        :data="tableData"
        v-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="用户名" align="center" key="username" prop="username" sortable="custom"/>
      <el-table-column label="姓名" align="center" key="cnName" prop="cnName" sortable="custom"/>
      <el-table-column label="手机号" align="center" key="phone" prop="phone" sortable="custom"/>
      <el-table-column label="邮箱" align="center" key="email" prop="email" sortable="custom"/>
      <el-table-column label="部门" align="center" key="deptName" prop="deptName" sortable="custom"/>
      <el-table-column label="职位" align="center" key="positionName" prop="positionName" sortable="custom"/>
      <el-table-column label="状态" align="center" key="status" prop="status" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="user_status" :value="scope.row.status"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" v-permission="'user:list:update'" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" v-permission="'user:list:remove'"
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
          <el-col>
            <el-form-item label="头像" prop="avatar">
              <avatar-upload ref="avatarUploadRef" :avatar="form.avatarName"></avatar-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" :disabled="!formDialog.isAdd" placeholder="请输入用户名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="formDialog.isAdd">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" show-password placeholder="请输入密码"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属部门" prop="deptId">
              <el-tree-select
                  class="dept-tree"
                  v-model="form.deptId"
                  filterable
                  :filter-node-method="filterNodeMethod"
                  :data="deptTree"
                  :props="{label:'name',children:'children'}"
                  node-key="id"
                  show-checkbox
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
            <el-form-item label="姓名" prop="cnName">
              <el-input v-model="form.cnName" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="职位" prop="positionIds">
              <wl-select v-model="form.positionIds" collapse-tags collapse-tags-tooltip :max-collapse-tags="1" multiple
                         :data-method="handlePositionList" label-str="name" value-str="id"
                         placeholder="请选择职位"></wl-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :value="1">男</el-radio>
                <el-radio :value="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="角色" prop="roleIds">
              <wl-checkbox v-model="form.roleIds" :data-method="handleRoleList" label-str="name"
                           value-str="id"></wl-checkbox>
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

<script setup name="UserInfo">
import {onMounted, ref} from "vue";
import {getDeptByUser} from "@/api/system/dept.js";
import {add, exportUser, getOne, page, remove, update} from "@/api/system/user.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {getPositionList} from "@/api/system/position.js";
import {
  getCheckboxParam,
  getDictMap,
  getTableRadioParam,
  handleExportResult,
  handleResult,
  isNotNullAppend
} from "@/utils/commonUtil.js";
import AvatarUpload from "@/components/upload/avatarUpload.vue";
import WlCheckbox from "@/components/checkbox/wlCheckbox.vue";
import {getRoleByUser} from "@/api/system/role.js";
import WlDict from "@/components/dict/wlDict.vue";
import WlExportButton from "@/components/button/wlExportButton.vue";

const {user_status} = getDictMap('user_status')


const loading = ref(false)
const queryForm = ref({
  currentPage: 1,
  pageSize: 10,
  isAsc: false,
  sortField: '',
  exportType: '1'
})
const queryFormRef = ref()
const deptTree = ref([])
const tableData = ref([])
const total = ref(0)
const formDialog = ref({
  visible: false,
  isAdd: true,
  title: '',
  loading: false
})
const form = ref({
  id: null,
  cnName: null,
  username: null,
  password: null,
  deptId: null,
  phone: null,
  email: null,
  age: 0,
  sex: null,
  status: null,
  profile: null,
  remarks: null,
  positionIds: [],
  avatarName: null,
  roleIds: []
})
const baseForm = {...form.value}
const formRef = ref()
const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)
const avatarUploadRef = ref()

const rules = ref({
  username: [
    {required: true, message: "用户名不能为空", trigger: "blur"}
  ],
  password: [
    {required: true, message: "密码不能为空", trigger: "blur"}
  ],
  deptId: [
    {required: true, message: "所属部门不能为空", trigger: "blur"}
  ],
})

getDeptByUser({}).then(res => {
  if (res.data.code === 200) {
    deptTree.value = res.data.data
  } else {
    ElMessage.error(res.data.msg)
  }
})

onMounted(() => {
  handleTableData()
})

// 所属部门筛选
const filterNodeMethod = (value, data) => {
  if (data && data.name) {
    return data.name.includes(value)
  } else {
    return false
  }
}


const statusChange = () => {

}
// // 重置 queryForm
// const resetQueryForm = (formEl) => {
//   if (!formEl) return
//   formEl.resetFields()
// }

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
  }).catch(() => {
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
  formDialog.value.title = '新增用户'
  formDialog.value.isAdd = true
  resetForm(formRef.value)
  formDialog.value.visible = true
}
// 修改
const handleUpdate = (row) => {
  formDialog.value.title = '修改用户'
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

// 获取岗位信息
const handlePositionList = () => {
  return new Promise((resolve, reject) => {
    getPositionList().then(res => {
      if (res.data.code === 200) {
        resolve(res.data.data);
      } else {
        ElMessage.error(res.data.msg)
      }
    }).catch(err => {
      reject(err);
    });
  })

}

// 获取角色信息
const handleRoleList = () => {
  return new Promise((resolve, reject) => {
    getRoleByUser().then(res => {
      if (res.data.code === 200) {
        resolve(res.data.data);
      } else {
        ElMessage.error(res.data.msg)
      }
    }).catch(err => {
      reject(err);
    });
  })
}

// 保存或修改
const saveOrUpdate = () => {

  const file = avatarUploadRef.value.getFile()
  const formData = new FormData();
  // 将文件添加到FormData对象中
  isNotNullAppend(formData, 'avatarFile', file);
  // 添加其他参数
  isNotNullAppend(formData, 'id', form.value.id);
  isNotNullAppend(formData, 'cnName', form.value.cnName);
  isNotNullAppend(formData, 'username', form.value.username);
  isNotNullAppend(formData, 'password', form.value.password);
  isNotNullAppend(formData, 'deptId', form.value.deptId);
  isNotNullAppend(formData, 'phone', form.value.phone);
  isNotNullAppend(formData, 'email', form.value.email);
  isNotNullAppend(formData, 'age', form.value.age);
  isNotNullAppend(formData, 'sex', form.value.sex);
  isNotNullAppend(formData, 'status', form.value.status);
  isNotNullAppend(formData, 'positionIds[]', form.value.positionIds);
  isNotNullAppend(formData, 'roleIds[]', form.value.roleIds);
  isNotNullAppend(formData, 'avatar', form.value.avatar);

  formRef.value.validate((valid, fields) => {
    if (valid) {
      if (formDialog.value.isAdd) {
        formDialog.value.loading = true
        add(formData).then(res => {
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
        update(formData).then(res => {
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

// 导出
const handleExport = () => {
  loading.value = true
  queryForm.value.ids = getCheckboxParam(undefined, selectData.value, 'id')
  exportUser(queryForm.value).then(res => {
    handleExportResult(res);
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

</script>

<style lang="scss" scoped>
.dept-tree {
  width: 200px;
}

</style>
