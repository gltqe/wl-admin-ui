<template>
  <div class="layout-content">
    <el-row class="search">
      <el-form
          ref="queryFormRef"
          :model="queryForm"
          :inline="true"
          label-width="80px"
      >
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="queryForm.name" clearable placeholder="请输入接口名称"></el-input>
        </el-form-item>
        <el-form-item label="接口URI" prop="uri">
          <el-input v-model="queryForm.uri" clearable placeholder="请输入接口URI"></el-input>
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
      <el-button plain size="small" icon="Plus" type="primary" v-permission="'apiLimit:list:add'" @click="handleAdd">
        新增
      </el-button>
      <el-button plain size="small" icon="Edit" type="warning" v-permission="'apiLimit:list:update'"
                 @click="handleUpdate" :disabled="!isRadio">修改
      </el-button>
      <el-button plain size="small" icon="Delete" type="danger" v-permission="'apiLimit:list:remove'"
                 @click="handleDelete" :disabled="!isSelect">删除
      </el-button>
      <el-button plain size="small" icon="Upload" type="info" v-permission="'apiLimit:list:import'">导入</el-button>
      <el-button plain size="small" icon="Download" type="success" v-permission="'apiLimit:list:export'">导出
      </el-button>
      <el-button plain size="small" icon="Refresh" type="danger" v-permission="'apiLimit:list:refresh'"
                 @click="handleRefresh">刷新缓存
      </el-button>
    </el-row>

    <el-table
        class="tableList"
        :data="tableData"
        v-loading="loading"
        @selection-change="selectionChange"
        @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="接口名称" align="center" key="name" prop="name" sortable="custom"/>
      <el-table-column label="接口URI" align="center" key="uri" prop="uri" sortable="custom"/>
      <el-table-column label="单用户频率" align="center" sortable="custom">
        <template #default="scope">
          <span>{{ handleRate(scope.row.singleFrequency, scope.row.singleTime, scope.row.singleTimeUnit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全用户频率" align="center" sortable="custom">
        <template #default="scope">
          <span>{{ handleRate(scope.row.wholeFrequency, scope.row.wholeTime, scope.row.wholeTimeUnit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" key="status" prop="status" sortable="custom">
        <template #default="scope">
          <wl-dict :data-map="sys_status" :value="scope.row.status"></wl-dict>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" v-permission="'apiLimit:list:update'"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button link type="primary" icon="Delete" v-permission="'apiLimit:list:remove'"
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
          label-width="100px"
          :inline="true"
      >
        <!--        <el-collapse v-model="['baseInfo','single','whole','other']" >-->
        <!--          <el-collapse-item title="基本信息" name="baseInfo">-->

        <!--          </el-collapse-item>-->
        <!--        </el-collapse>-->
        <el-row>
          <el-col :span="8">
            <el-form-item label="接口名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入接口名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口URI" prop="uri">
              <el-input v-model="form.uri" placeholder="请输入接口URI"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <wl-radio v-model="form.status" dict-code="sys_status" placeholder="请选择状态"></wl-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider/>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单用户次数" prop="singleFrequency">
              <el-input-number v-model="form.singleFrequency"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单用户时间" prop="singleTime">
              <el-input v-model="form.singleTime" placeholder="请输入单用户时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间单位" prop="singleTimeUnit">
              <wl-select v-model="form.singleTimeUnit" dict-code="time_unit" placeholder="请选择时间单位"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider/>
        <el-row>
          <el-col :span="8">
            <el-form-item label="全用户次数" prop="wholeFrequency">
              <el-input-number v-model="form.wholeFrequency"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="全用户时间" prop="wholeTime">
              <el-input v-model="form.wholeTime" placeholder="请输入全用户时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间单位" prop="wholeTimeUnit">
              <wl-select v-model="form.wholeTimeUnit" dict-code="time_unit" placeholder="请选择时间单位"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider/>
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
  </div>
</template>

<script setup name="ApiLimit">
import {onMounted, ref} from "vue";
import {page, getOne, remove, add, update, refresh} from "@/api/system/apiLimit.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {handleResult, getCheckboxParam, getTableRadioParam, getDictMap} from "@/utils/commonUtil.js";
import WlSelect from "@/components/select/wlSelect.vue";

const {sys_status, time_unit} = getDictMap('sys_status', 'time_unit')
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
  uri: null,
  singleFrequency: null,
  singleTime: null,
  singleTimeUnit: null,
  singleTimeSecond: null,
  singleLimiterRate: null,
  wholeFrequency: null,
  wholeTime: null,
  wholeTimeUnit: null,
  wholeTimeSecond: null,
  wholeLimiterRate: null,
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
    {required: true, message: "接口名称不能为空", trigger: "blur"}
  ],
  uri: [
    {required: true, message: "uri不能为空", trigger: "blur"}
  ],
})


onMounted(() => {
  handleTableData()
})

// 获取 表数据
const handleTableData = () => {
  loading.value = true
  page(queryForm.value).then(res => {
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

// 频率
const handleRate = (frequency, time, unit) => {
  return frequency + '次 / ' + time + time_unit.value[unit].text
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
    const ids = getCheckboxParam(row, selectData.value, 'uri')
    remove(ids).then(res => {
      handleResult(res)
      handleTableData()
    })
  }).catch(() => {

  })
}
// 刷新缓存
const handleRefresh = () => {
  refresh().then(res => {
    handleResult(res)
  })
}


</script>

<style lang="scss" scoped>

</style>
