<template>
  <div>
    <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
    >
      <el-form-item ref="old" label="旧密码" prop="old" v-if="needOld">
        <el-input id="old" v-model="form.old" show-password/>
      </el-form-item>
      <el-form-item ref="new1" label="新密码" prop="new1">
        <el-input id="new1" v-model="form.new1" show-password/>
      </el-form-item>
      <el-form-item ref="new2" label="再次输入" prop="new2">
        <el-input id="new2" v-model="form.new2" show-password/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
        <el-button type="danger" @click="close">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="UpdatePassword">
import {ref} from "vue";
import {updateSelfPassword, updateOtherPassword} from "@/api/system/user.js";
import {useRouter} from "vue-router";
import {handleResult} from "@/utils/commonUtil.js";

const router = useRouter()

const props = defineProps({
  needOld: {
    type: Boolean,
    required: false,
    default: true
  }
})

const form = ref({
  old: '',
  new1: '',
  new2: ''
})
const formRef = ref({});

const checkPassword1 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (form.value.new2 !== '') {
      if (!formRef.value) return
      formRef.value.validateField('new2', () => null)
    }
    callback()
  }
}
const checkPassword2 = (rule, value, callback) => {
  if (value === '' || form.value.new1 === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.value.new1) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
const rules = ref({
  old: [
    {required: true, message: "原密码不能为空", trigger: "blur"}

  ],
  new1: [
    {required: true, message: "新密码不能为空", trigger: "blur"},
    {required: true, validator: checkPassword1, message: "原密码不能为空", trigger: "blur"},
    {
      required: true,
      pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
      message: '必须包含大写字母、小写字母、数字，长度为8-16位',
      trigger: 'blur'
    }
  ],
  new2: [
    {required: true, message: "请再次输入密码", trigger: "blur"},
    {required: true, validator: checkPassword2, message: "两次输入密码不一致", trigger: "blur"}
  ]
})


const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (props.needOld) {
        updateSelfPassword(form.value).then(res => {
          handleResult(res)
        })
      } else {
        updateOtherPassword(form.value).then(res => {
          handleResult(res)
        })
      }

    } else {
      return false
    }
  })
}
const close = () => {
  router.push({path: '/'})
}
</script>

<style scoped>

</style>
