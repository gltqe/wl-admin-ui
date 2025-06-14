<template>
  <el-card class="login-card">
    <el-form ref="form" :model="loginForm" class="login-form">
      <div class="title-div">
        <span class="title">{{ title }}</span>
      </div>
      <el-row>
        <el-col>
          <el-form-item>
            <el-input v-model="loginForm.username" prefix-icon="User" class="input-username box"
                      placeholder="admin">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-input v-model="loginForm.password" prefix-icon="Lock" class="input-password box" placeholder="123456"
                      type="password" @keyup.enter.native="handleLogin">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-form-item v-if="hasCaptcha">
          <el-col :span="14">
            <el-input v-model="loginForm.captchaValue" prefix-icon="Lock" class="input-captcha"
                      @keyup.enter.native="handleLogin">
            </el-input>
          </el-col>
          <el-col :span="10">
            <div class="img-div">
              <el-image v-if="imageUrl" :src="imageUrl" class="img-captcha" fit="fill" @click="handleCaptcha"/>
            </div>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-checkbox v-model="isRemember" class="remember-password">
            记住账号密码
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button :loading="loading" class="submit-btn" type="primary" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-col>
      </el-row>
<!--      <span class="error-tip" v-if="msg">{{ msg }}</span>-->
    </el-form>
  </el-card>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {getCaptcha, login} from '@/api/system/login'
import {useRoute} from 'vue-router'
import {ACCESS_HEAD, REFRESH_HEAD} from "@/common/constant.js";
import {logoutClear} from "@/utils/auth.js";
import router from '@/router/index'
import {User} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const redirectPath = useRoute().query.redirect
// const redirectMsg = useRoute().query.msg


const loginForm = ref({
  username: 'admin',
  password: '123456',
  captchaKey: '',
  captchaValue: ''
})
// const msg = ref('')
const loading = ref(false)
const isRemember = ref(true)
const imageUrl = ref(null)
const hasCaptcha = ref(true)

const title = ref(import.meta.env.VITE_NAME)

onMounted(() => {
  // msg.value = redirectMsg ? redirectMsg : ''
  handleCaptcha()
  getDefault()
})

const getDefault = () => {
  loginForm.value.username = localStorage.getItem('username') === null ? loginForm.value.username : localStorage.getItem('username')
  loginForm.value.password = localStorage.getItem('password') === null ? loginForm.value.password : localStorage.getItem('password')
  isRemember.value = Boolean(localStorage.getItem('isRemember'))
}

const handleLogin = () => {
  if (isRemember.value) {
    localStorage.setItem('username', loginForm.value.username)
    localStorage.setItem('password', loginForm.value.password)
    localStorage.setItem('isRemember', isRemember.value.toString())
  } else {
    localStorage.removeItem('username')
    localStorage.removeItem('password')
    localStorage.removeItem('isRemember')
  }
  loading.value = true
  login(loginForm.value).then(res => {
    if (res.data.code === 200) {
      const accessToken = res.data.data.accessToken
      const refreshToken = res.data.data.refreshToken
      localStorage.setItem(ACCESS_HEAD, accessToken)
      localStorage.setItem(REFRESH_HEAD, refreshToken)
      router.push({path: redirectPath || '/'})
      ElMessage.success('欢迎进入wl-admin管理系统！')
    } else {
      loading.value = false
      ElMessage.error(res.data.msg)
      logoutClear()
      handleCaptcha()
    }
    // msg.value = res.data.msg
  }).catch(res => {
    // msg.value = res.toString()
    loading.value = false
    handleCaptcha()
  })
}

const handleCaptcha = () => {
  getCaptcha().then(res => {
    if (res.data.code === 200) {
      hasCaptcha.value = res.data.data.hasCaptcha
      if (res.data.data.hasCaptcha) {
        imageUrl.value = res.data.data.captchaValue
        loginForm.value.captchaKey = res.data.data.captchaKey
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.login-card {
  text-align: center;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 100vw;
  max-width: 430px;
  margin: auto; /* 屏幕左右居中 */
  border-radius: 20px;

  .login-form {
    text-align: center;

    .title-div {
      margin-bottom: 30px;
    }

    .title {
      font-size: 32px;
      font-weight: bolder;
      color: #505052;
    }

    .img-div {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .img-captcha {
      max-width: 85%;
      max-height: 10%;
    }

    .submit-btn {
      width: 100%;
    }

    .error-tip {
      color: red;
      //margin-top: 10px;
    }
  }
}
</style>
