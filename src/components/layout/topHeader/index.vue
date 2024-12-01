<template>
  <el-header class="header">
    <div class="header-left">
      <el-icon class="hidden-xs-only menu-collapse-icon" size="22" @click="menuStore.collapseMenu">
        <Expand v-if="!menuStore.menuCollapse"/>
        <Fold v-if="menuStore.menuCollapse"/>
      </el-icon>
      <el-icon class="hidden-sm-and-up menu-collapse-icon" size="22" @click="menuStore.activeMenu">
        <!--      <Expand v-if="menuStore.menuActive"/>-->
        <Fold v-if="!menuStore.menuActive"/>
      </el-icon>
      <el-breadcrumb class="breadcrumb" separator-icon="ArrowRight">
        <el-breadcrumb-item class="main-breadcrumb" to="/">首页</el-breadcrumb-item>
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-if="titleList && titleList.length>0" v-for="(item,index) in titleList" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
    <div class="header-right">

      <el-dropdown
          :show-timeout="100"
          :hide-timeout="100"
          placement="bottom-start"
      >
        <div class="avatar-div">
          <el-avatar class="avatar" shape="square" :src="imageUrl"></el-avatar>
          <span class="user-cn-name hidden-xs-only">{{ userStore.userInfo.cnName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toSelf">个人中心</el-dropdown-item>
            <el-dropdown-item @click="colorLayout">颜色布局</el-dropdown-item>
            <el-dropdown-item>系统消息</el-dropdown-item>
            <el-dropdown-item divided @click="handleLoginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-drawer
        v-model="colorLayoutDialog.visible"
        title="颜色布局"
        close-on-click-modal
        direction="rtl"
    >
      <el-descriptions :column="1">
        <el-descriptions-item label-class-name="des-label" label="夜晚模式：">
          <template #default>
            <el-switch v-model="isDarkValue" class="dark-switch" active-action-icon="Moon"
                       inactive-action-icon="Sunny" style="margin-right: 10px" @change="switchChange"/>
          </template>
        </el-descriptions-item>

        <!--        <el-descriptions-item label-class-name="des-label" label="菜单背景颜色：">-->
        <!--          <template #default>-->
        <!--            <el-color-picker v-model="colorLayoutDialog.menuBackground" show-alpha-->
        <!--                             @change="(value)=>changeMenuColor(value,'menuBackground')"/>-->
        <!--          </template>-->
        <!--        </el-descriptions-item>-->
      </el-descriptions>
    </el-drawer>
  </el-header>
</template>

<script setup>
import {ArrowRight} from "@element-plus/icons-vue";
import {useMenuStore} from "@/stores/modules/menu.js";
import {useUserStore} from "@/stores/modules/user.js";
import {useRoute, useRouter} from "vue-router";
import {computed, ref, watch} from "vue";
import WlCheckbox from "@/components/checkbox/wlCheckbox.vue";
import {ElMessageBox} from "element-plus";
import {logout} from "@/api/system/login.js";
import {ACCESS_HEAD, REFRESH_HEAD} from "@/common/constant.js";
import {handleResult} from "@/utils/commonUtil.js";
import avatar from '@/assets/images/avatar.jpg'

const menuStore = useMenuStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const titleList = ref([])
const avatarPre = import.meta.env.VITE_AVATAR_PRE
const imageUrl = computed(() => {
  if (userStore.userInfo.avatarName) {
    return avatarPre + userStore.userInfo.avatarName
  } else {
    return avatar
  }
})


const matched = route.matched
if (matched && matched.length > 0 && matched[matched.length - 1].meta) {
  if (matched[matched.length - 1].path === '/main') {
    titleList.value = []
  } else {
    titleList.value = matched[matched.length - 1].meta.titleList
  }
}
// 右侧颜色布局栏
const colorLayoutDialog = ref({
  visible: false,
  menuBackground: null
})

const colorLayout = () => {
  colorLayoutDialog.value.visible = true
}
// 转换主题
const isDark = localStorage.getItem('isDark')
const isDarkValue = ref(isDark === '1')
let html = document.documentElement
isDarkValue.value ? html.className = 'dark' : html.className = 'light'
const switchChange = (val) => {
  let html = document.documentElement  //获取html根元素
  val ? html.className = 'dark' : html.className = 'light' //判断开关打开添加dark 否则不添加
  localStorage.setItem('isDark', val ? '1' : '0')
}
// // 转换菜单颜色
// const changeMenuColor = (color,type) => {
//   if (type==='menuBackground'){
//     localStorage.setItem('menuBackground',color)
//   }
// }


watch(
    () => route.matched,
    (newMatched, oldMatched) => {
      if (newMatched[newMatched.length - 1].path === '/main') {
        titleList.value = []
        return
      }
      if (newMatched && newMatched.length > 0 && newMatched[newMatched.length - 1].meta) {
        titleList.value = newMatched[newMatched.length - 1].meta.titleList
      }
    }
)

const toSelf = () => {
  router.push('/self')
}

const handleLoginOut = () => {
  ElMessageBox.confirm('是否注销用户?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    logout().then(res => {
      handleResult(res)
      localStorage.removeItem(ACCESS_HEAD)
      localStorage.removeItem(REFRESH_HEAD)
    })
    userStore.resetUser()
    menuStore.resetMenu()
    router.push('/login')
  }).catch(() => {

  })
}

// getFileInfo({id: userStore.userInfo.avatar}).then(res => {
//   if (res.data.code === 200) {
//     if (res.data.data && res.data.data.uuidName) {
//       imageUrl.value = 'avatar/' + res.data.data.uuidName
//     } else {
//       imageUrl.value = avatar
//     }
//   } else {
//     ElMessage.error(res.data.msg)
//   }
// })

</script>

<style lang="scss" scoped>
.el-header {
  height: 50px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    align-items: center;

    .menu-collapse-icon {
      cursor: pointer;
    }

    .main-breadcrumb {
      margin-left: 18px;
    }

    :deep(.el-breadcrumb__inner) {
      font-size: medium;
    }
  }

  .header-right {
    .avatar-div {
      display: flex;
      align-items: center;

      .user-cn-name {
        margin-left: 10px;
        font-weight: 600;
      }
    }

    .avatar-div:focus-visible {
      outline: none;
    }
  }

}

/* 面包屑过渡动画 */
.breadcrumb-enter-active {
  transition: all 0.4s;
}

.breadcrumb-leave-active {
  transition: all 0.3s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}


</style>
