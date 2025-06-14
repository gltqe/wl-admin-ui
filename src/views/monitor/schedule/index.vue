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
          <el-input v-model="queryForm.taskName" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="任务分组" prop="taskGroup">
          <wl-select v-model="queryForm.taskGroup" @change="handleTableData" placeholder="请选择任务分组"
                     dict-code="task_group" clearable></wl-select>
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
      <el-button plain size="small" icon="Plus" type="primary" v-permission="'task:list:add'" @click="handleAdd">新增</el-button>
      <el-button plain size="small" icon="Edit" type="warning" v-permission="'task:list:update'" @click="handleUpdate" :disabled="!isRadio">修改
      </el-button>
      <el-button plain size="small" icon="Delete" type="danger" v-permission="'task:list:remove'" @click="handleDelete" :disabled="!isSelect">删除
      </el-button>
      <el-button plain size="small" icon="Upload" type="info" v-permission="'task:list:import'">导入</el-button>
      <el-button plain size="small" icon="Download" type="success" v-permission="'task:list:export'">导出</el-button>
    </el-row>

    <el-table
        class="tableList"
        :data="tableData"
        v-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="任务名" align="center" key="taskName" prop="taskName" sortable="custom"/>
      <el-table-column label="任务分组" align="center" key="taskGroup" prop="taskGroup" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="task_group" :value="scope.row.taskGroup"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="类名" align="center" key="beanName" prop="beanName" sortable="custom"/>
      <el-table-column label="方法名" align="center" key="methodName" prop="methodName" sortable="custom"/>
      <el-table-column label="cron表达式" align="center" key="cronExpression" prop="cronExpression" sortable="custom"/>
      <el-table-column label="状态" align="center" key="status" prop="status" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="sys_status" :value="scope.row.status"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200">
        <template #default="scope">
          <div class="operation-column">
            <el-button link type="primary" icon="Edit" v-permission="'task:list:update'" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button link type="primary" icon="Delete" v-permission="'task:list:remove'" @click="handleDelete(scope.row)">删除</el-button>
            <el-dropdown>
              <el-button class="el-dropdown-button" link type="primary">更多
                <el-icon class="el-icon--right">
                  <ArrowDown/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-permission="'task:list:run'">
                    <el-button link type="primary"  icon="CaretRight" @click="handleExecute(scope.row)">
                      立即执行
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-permission="'task:list:info'">
                    <el-button link type="primary"  icon="View" @click="handleSelect(scope.row)">
                      查看详情
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-permission="'task:list:log'">
                    <el-button link type="primary"  icon="Tickets" @click="handleLogList(scope.row)">
                      任务日志
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

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
          label-width="100px"
          :inline="true"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务名" prop="taskName">
              <el-input v-model="form.taskName" placeholder="请输入任务名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务分组" prop="taskGroup">
              <wl-select v-model="form.taskGroup" dict-code="task_group" placeholder="请选择任务分组"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="cron" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron表达式"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="类名" prop="beanName">
              <el-input v-model="form.beanName" placeholder="请输入类名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方法名" prop="methodName">
              <el-input v-model="form.methodName" placeholder="请输入方法名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <wl-radio v-model="form.status" dict-code="sys_status"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="执行策略" prop="executePolicy">
              <wl-select v-model="form.executePolicy" dict-code="execute_policy" placeholder="请选择执行策略"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="并发" prop="concurrent">
              <wl-radio v-model="form.concurrent" dict-code="task_concurrent"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数" prop="params">
              <el-input class="dialog-row-input" v-model="form.params" placeholder="请输入参数"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
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

    <el-dialog
        ref="infoDialogRef"
        v-model="infoDialog.visible"
        :title="infoDialog.title"
        width="1000"
        destroy-on-close
    >
      <el-descriptions :column="3">
        <el-descriptions-item label-class-name="des-label" label="任务名：">{{ form.taskName }}</el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="任务分组：">
          <wl-dict :data-map="task_group" :value="form.taskGroup"></wl-dict>
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="cron：">{{
            form.cronExpression
          }}
        </el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="类名：">{{ form.beanName }}</el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="方法名：">{{ form.methodName }}</el-descriptions-item>
        <el-descriptions-item label-class-name="des-label" label="状态：">
          <wl-dict :data-map="sys_status" :value="form.status"></wl-dict>
        </el-descriptions-item>
        <el-descriptions-item :span="1" label-class-name="des-label" label="执行策略：">
          <wl-dict :data-map="execute_policy" :value="form.executePolicy"></wl-dict>
        </el-descriptions-item>
        <el-descriptions-item :span="2" label-class-name="des-label" label="并发：">
          <wl-dict :data-map="task_concurrent" :value="form.concurrent"></wl-dict>
        </el-descriptions-item>
        <el-descriptions-item :span="3" label-class-name="des-label" label="参数：">{{
            form.params
          }}
        </el-descriptions-item>
        <el-descriptions-item :span="3" label-class-name="des-label" label="备注：">{{
            form.remarks
          }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="ScheduleInfo">
import {onMounted, ref} from "vue";
import {getScheduleList, getOne, remove, add, update, run} from "@/api/monitor/schedule.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {handleResult, getCheckboxParam, getTableRadioParam, getDictMap} from "@/utils/commonUtil.js";

import WlSelect from "@/components/select/wlSelect.vue";
import WlRadio from "@/components/radio/wlRadio.vue";
import WlDict from "@/components/dict/wlDict.vue";
import {useRouter} from "vue-router";

const router = useRouter()

const {
  sys_status,
  task_group,
  execute_policy,
  task_concurrent
} = getDictMap('sys_status', 'task_group', 'execute_policy', 'task_concurrent')
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
  taskName: null,
  taskGroup: null,
  beanName: null,
  methodName: null,
  params: null,
  cronExpression: null,
  executePolicy: null,
  concurrent: null,
  status: null,
  remark: null
})
const baseForm = {...form.value}
const formRef = ref()

const infoDialog = ref({
  visible: false,
  title: '任务详情'
})

const selectData = ref([])
const isRadio = ref(false)
const isSelect = ref(false)

const rules = ref({
  taskName: [
    {required: true, message: "任务名不能为空", trigger: "blur"}
  ],
  taskGroup: [
    {required: true, message: "任务分组不能为空", trigger: "blur"}
  ],
  cronExpression: [
    {required: true, message: "cron不能为空", trigger: "blur"}
  ],
  beanName: [
    {required: true, message: "类名不能为空", trigger: "blur"}
  ],
  methodName: [
    {required: true, message: "方法名不能为空", trigger: "blur"}
  ]
})


onMounted(() => {
  handleTableData()
})

// 获取 表数据
const handleTableData = () => {
  loading.value = true
  getScheduleList(queryForm.value).then(res => {
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
  formDialog.value.title = '新增参数'
  formDialog.value.isAdd = true
  resetForm(formRef.value)
  formDialog.value.visible = true
}
// 修改
const handleUpdate = (row) => {
  formDialog.value.title = '修改参数'
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
    const ids = getCheckboxParam(row, selectData.value, 'id')
    remove(ids).then(res => {
      handleResult(res)
      handleTableData()
    })
  }).catch(() => {

  })
}
// 立即执行
const handleExecute = (row) => {
  ElMessageBox.confirm('是否立即执行一次<' + row.taskName + '>任务', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const ids = getCheckboxParam(row, selectData.value, 'id')
    run(ids).then(res => {
      handleResult(res)
    })
  }).catch(() => {
  })
}
// 查看详情
const handleSelect = (row) => {
  getOne({id: row.id}).then(res => {
    if (res.data.code === 200) {
      form.value = res.data.data
      infoDialog.value.visible = true
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}
import {useTagStore} from "@/stores/modules/tag.js";
const tagStore = useTagStore()
// 查看任务日志
const handleLogList = (row) => {
  // 清理缓存
  tagStore.deleteCacheMenuList('ScheduleLog')
  router.push({name: 'ScheduleLog', query: {taskId: row.id, taskName: row.taskName}})
}

</script>

<style lang="scss" scoped>
.el-dropdown-button {
  outline: none;
  margin-left: 12px;
}

</style>
