<template>
  <div class="layout-content">
    <!--    <el-input v-model="text"></el-input>-->
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        <el-card class="card left">
          <div class="avatar-div">
            <avatar-upload ref="avatarUploadRef"  v-model:avatar="baseForm.avatarName"></avatar-upload>
          </div>
          <div class="name-div">
            <h1>{{ selfInfo.cnName }}</h1>
          </div>
          <!--          <el-divider />-->
          <div class="item-div">
            <el-icon>
              <User/>
            </el-icon>
            <span>{{ selfInfo.username }}</span>
          </div>
          <el-divider/>
          <div class="item-div">
            <el-icon>
              <Phone/>
            </el-icon>
            <span>{{ selfInfo.phone }}</span>
          </div>
          <el-divider/>
          <div class="item-div">
            <el-icon>
              <Message/>
            </el-icon>
            <span>{{ selfInfo.email }}</span>
          </div>
          <el-divider/>
          <div class="item-div">
            <wl-icon name="dept"></wl-icon>
            <span>{{ selfInfo.deptName }}</span>
          </div>
          <el-divider/>
          <div class="item-div">
            <el-icon>
              <Position/>
            </el-icon>
            <span>{{ selfInfo.positionName }}</span>
          </div>
          <el-divider/>
          <div class="item-div">
            <el-icon>
              <Timer/>
            </el-icon>
            <span>{{ selfInfo.createTime }}</span>
          </div>
          <el-divider/>
        </el-card>
      </el-col>
      <!--  右侧    -->
      <el-col :span="16" :xs="24">
        <el-card class="card right">
          <el-tabs v-model="activeTab" @tab-click="handleClickTab">
            <el-tab-pane label="基本信息" name="first">
              <el-form
                  ref="baseFormRef"
                  :model="baseForm"
                  :rules="rules"
                  label-width="80px"
              >
                <el-form-item label="姓名" prop="cnName">
                  <el-input v-model="baseForm.cnName"/>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="baseForm.phone"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="baseForm.email"/>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                  <el-input v-model="baseForm.age"/>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="baseForm.sex">
                    <el-radio :value="1">男</el-radio>
                    <el-radio :value="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="简介" prop="profile">
                  <el-input v-model="baseForm.profile" placeholder="请输入个人简介" :maxlength="200" show-word-limit
                            type="textarea"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveBaseInfo">保存</el-button>
                  <el-button type="danger" @click="close">关闭</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <update-password :need-old="false"></update-password>
            </el-tab-pane>
            <el-tab-pane label="其他" name="third">其他</el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Self">
import UpdatePassword from '@/components/updatePassword/index.vue'
import {nextTick, ref} from "vue";
import {getSelfInfo, updateSelf} from "@/api/system/user.js";
import WlIcon from "@/components/icons/wlIcon.vue";
import {useRouter} from "vue-router";
import AvatarUpload from "@/components/upload/avatarUpload.vue";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/stores/modules/user.js";
import {isNotNullAppend} from "@/utils/commonUtil.js";

const router = useRouter()
const userStore = useUserStore()

const baseFormRef = ref()
const selfInfo = ref({
  cnName: null,
  phone: null,
  email: null,
  age: null,
  sex: 1,
  profile: null,
  avatar: null,
  avatarName: null
})
const activeTab = ref('first')

const baseForm = ref({
  cnName: null,
  phone: null,
  email: null,
  age: null,
  sex: 1,
  profile: null,
  avatar: null,
  avatarName: null
})
const avatarUploadRef = ref()

const rules = ref({
  cnName: [
    {required: true, message: "用户姓名不能为空", trigger: "blur"}
  ],
  phone: [
    {required: true, message: "手机号不能为空", trigger: "blur"}
  ],
  email: [
    {required: true, message: "邮箱地址不能为空", trigger: "blur"},
    {type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]}
  ]
});


getSelfInfo().then(res => {
  if (res.data.code === 200) {
    nextTick(() => {
      selfInfo.value = res.data.data
      baseForm.value.cnName = selfInfo.value.cnName
      baseForm.value.phone = selfInfo.value.phone
      baseForm.value.email = selfInfo.value.email
      baseForm.value.age = selfInfo.value.age
      baseForm.value.sex = selfInfo.value.sex
      baseForm.value.profile = selfInfo.value.profile
      baseForm.value.avatar = selfInfo.value.avatar
      baseForm.value.avatarName = selfInfo.value.avatarName
    })
  } else {
    ElMessage.error(res.data.msg)
  }
})


const handleClickTab = () => {
}

const saveBaseInfo = () => {
  baseFormRef.value.validate((valid, fields) => {
    if (valid){
      const formData = new FormData()
      const file = avatarUploadRef.value.getFile()
      // isNotNullAppend('sysUserVo', JSON.stringify(baseForm.value))
      isNotNullAppend(formData,'cnName', baseForm.value.cnName)
      isNotNullAppend(formData,'phone', baseForm.value.phone)
      isNotNullAppend(formData,'email', baseForm.value.email)
      isNotNullAppend(formData,'age', baseForm.value.age)
      isNotNullAppend(formData,'sex', baseForm.value.sex)
      isNotNullAppend(formData,'profile', baseForm.value.profile)
      isNotNullAppend(formData,'avatar', file);
      updateSelf(formData).then(res => {
        if (res.data.code === 200) {
          userStore.setUserInfo()
          ElMessage.success(res.data.msg)
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }
  })

}
const close = () => {
  router.push({path: '/'})
}

</script>

<style scoped>

.card {
  height: 100%;
}

.avatar-div {
  text-align: center
}

.name-div {
  text-align: center;
}

.item-div {
  text-align: center;
  display: flex;
  justify-content: space-between;
  padding: 0 20%;
  font-family: "Microsoft YaHei";
  font-weight: 600;
}

.el-divider--horizontal {
  margin: 12px 0px;
}
</style>
