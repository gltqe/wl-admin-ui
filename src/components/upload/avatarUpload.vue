<template>
  <div>
    <el-upload
        class="avatar-uploader"
        v-bind="$attrs"
        action="#"
        list-type="picture"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-change="handleChange"
        :auto-upload="false"
        :disabled="disable"
    >
      <div v-if="imageUrl"
           class="avatar-container">
        <img :src="imageUrl" class="avatar-image">
        <el-space :size="15" class="avatar-actions">
          <el-button link icon="ZoomIn" @click.stop="handleAvatarPreview"/>
          <el-button link icon="Download" @click.stop="handleDownloadImage"/>
          <el-button link icon="Delete" @click.stop="handleAvatarRemove"/>
        </el-space>
      </div>
      <!--    <img class="avatar" v-if="imageUrl" :src="imageUrl" alt="preview image"/>-->
      <el-icon v-else class="avatar-uploader-icon">
        <Plus/>
      </el-icon>
    </el-upload>
    <el-image-viewer v-if="preview"
                     :teleported="true"
                     @close="()=> preview = false"
                     :url-list="new Array(imageUrl)">
    </el-image-viewer>
  </div>
</template>

<script setup name="AvatarUpload">
import {onMounted, ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import {getFileInfo} from "@/api/commons/fileInfo.js";

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  avatar: {
    type: String,
    default: ''
  }
})
const avatarPre = import.meta.env.VITE_AVATAR_PRE

const imageUrl = ref()
const file = ref()
const disable = ref(false)
const preview = ref(false)
const emits = defineEmits(['update:avatar']);

watch(() => props.avatar, (newMatched, oldMatched) => {
  if (newMatched) {
    handleFileInfo(props.avatar)
  }
})

onMounted(() => {
  if (props.avatar) {
    handleFileInfo(props.avatar)
  }
})

const handleFileInfo = (avatar) => {
  imageUrl.value = avatarPre + avatar
  disable.value = true
}


const handleChange = (uploadFile) => {
  const checkFlag = beforeUpload(uploadFile.raw)
  if (checkFlag) {
    file.value = uploadFile.raw
    imageUrl.value = URL.createObjectURL(uploadFile.raw)
    disable.value = true
  } else {
    imageUrl.value = undefined
    disable.value = false
  }
}

const getFile = () => {
  return file.value
}

const beforeUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('图片只支持jpg、png格式')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过' + '2MB')
    return false
  }
  return true
}

const handleAvatarPreview = () => {
  preview.value = true
}

const handleAvatarRemove = (uploadFile) => {
  imageUrl.value = ''
  file.value = null;
  // 允许上传新文件
  disable.value = false;
  // 通知父组件头像已移除
  emits('update:avatar', '');
}

const handleDownloadImage = () => {
  // 创建一个 a 标签
  const a = document.createElement('a');
  // 设置 a 标签的 href 属性为 blobUrl
  a.href = imageUrl.value;
  // 设置下载属性为文件名
  a.download = 'avatar';
  // 将 a 标签添加到 body 中
  document.body.appendChild(a);
  // 触发点击事件
  a.click();
  // 移除 a 标签
  document.body.removeChild(a);
}


defineExpose({
  getFile,
  imageUrl
})
</script>

<style>


.avatar-container {
  position: relative;
  height: 178px;
  width: 178px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}

.avatar-image {
  height: 178px;
  width: 178px;
}

.avatar-actions {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  opacity: 0;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;

  .el-button {
    font-size: 20px;
    color: #FFFFFF;
    font-weight: 500;
  }
}

.avatar-actions:hover {
  opacity: 1;
  background-color: var(--el-overlay-color-lighter);
  transition: opacity var(--el-transition-duration);
}

.el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: white;
  transition: var(--el-transition-duration-fast);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.el-upload.is-disabled {
  cursor: auto;
}

</style>
