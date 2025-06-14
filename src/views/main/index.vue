<template>
  <div class="layout-content">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-descriptions title="您当前地址信息：" :column="1" v-if="queryStatus">
          <!--          <el-descriptions-item label-class-name="des-label" label="洲：">{{ form.continent }}</el-descriptions-item>-->
          <!--          <el-descriptions-item label-class-name="des-label" label="洲编码：">{{ form.continentCode }}</el-descriptions-item>-->
          <el-descriptions-item label-class-name="des-label" label="IP：">{{ form.ip }}</el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="国家：">{{ form.country }}</el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="国家编码：">{{
              form.areacode
            }}
          </el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="省：">{{ form.prov }}</el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="城市：">{{ form.city }}</el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="区县：">{{ form.district }}</el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="地区编码：">{{ form.adcode }}</el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="纬度：">{{ form.lat }}</el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="经度：">{{ form.lng }}</el-descriptions-item>
          <el-descriptions-item label-class-name="des-label" label="时区：">{{ form.timezone }}</el-descriptions-item>
<!--          <el-descriptions-item label-class-name="des-label" label="时差：">{{ form.timezone }}</el-descriptions-item>-->
<!--          <el-descriptions-item label-class-name="des-label" label="币种：">{{ form.currency }}</el-descriptions-item>-->
          <el-descriptions-item label-class-name="des-label" label="运营商：">{{ form.isp }}</el-descriptions-item>
<!--          <el-descriptions-item label-class-name="des-label" label="组织：">{{ form.org }}</el-descriptions-item>-->
          <!--          <el-descriptions-item label-class-name="des-label" label="as：">{{ form.as }}</el-descriptions-item>-->
          <!--          <el-descriptions-item label-class-name="des-label" label="asname：">{{ form.asname }}</el-descriptions-item>-->
          <!--          <el-descriptions-item label-class-name="des-label" label="mobile：">{{form.mobile }}</el-descriptions-item>-->
          <!--          <el-descriptions-item label-class-name="des-label" label="proxy：">{{ form.proxy }}</el-descriptions-item>-->
          <!--          <el-descriptions-item label-class-name="des-label" label="hosting：">{{ form.hosting }}</el-descriptions-item>-->
        </el-descriptions>
        <div class="error-div" v-else>
          <h3 class="error-title">地址信息查询失败：</h3>
          <p class="error-msg">{{ errorMsg }}</p>
        </div>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📢📣  项目介绍</span>
            </div>
          </template>
          <p>前端：Vue3.x + Element-plus2.x + Axios1.7.x + Echarts5.x</p>
          <p>后端：Springboot3.x + SpringSecurity3.x + Mybatis-plus3.5.x + Quartz3.x + JWT</p>
          <p>数据库：Mysql8.x + redis5.x</p>
          <p>项目特点：</p>
          <p>功能权限 + 数据权限 + 无限级菜单 + 移动端适配</p>
        </el-card>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>🦄🔔  系统通知</span>
            </div>
          </template>
          <p>后续更新：</p>
          <p>1.集成EasyExcel完成导入导出</p>
          <p>2.基于jackson实现接口加解密、数据脱敏、字典翻译</p>
          <p>3.实现消息通知、系统通告功能</p>
          <p>4.邮箱、手机号注册等</p>
        </el-card>
      </el-col>
    </el-row>

<!--    <el-button @click="toggleDark">切换</el-button>-->


  </div>
</template>

<script setup name="Main">
import {ipInfo} from "@/api/system/home.js";
import {ref} from "vue";
import {Paperclip} from "@element-plus/icons-vue";
import axios from "axios";



const form = ref({})
const queryStatus = ref(true)
const errorMsg = ref('')
axios.get('https://qifu.baidu.com/ip/local/geo/v1/district').then(res=>{
  if (res.data.code==='Success'){
    console.log(res.data.data)
    form.value = res.data.data
    form.value.ip = res.data.ip
  }else {

  }
})
// ipInfo().then(res => {
//   if (res.data.code === 200) {
//     if (res.data.data.status === 'success') {
//       form.value = res.data.data
//       queryStatus.value = true
//     } else {
//       errorMsg.value = JSON.stringify(res.data.data)
//       queryStatus.value = false
//     }
//   }
// })
const handleIpInfo = () => {
}

</script>

<style lang="scss" scoped>
.ip-div {
  text-align: center;
}

.error-msg {
  color: red;
}

</style>
