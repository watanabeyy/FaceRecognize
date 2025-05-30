<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 导航栏 - 移动端适配 -->
    <div class="flex justify-end mb-6">
      <el-button
          link
          type="primary"
          size="small"
          @click="$router.push('/login')"
          class="!px-2"
      >
        登录
      </el-button>
      <el-button
          type="primary"
          size="small"
          @click="$router.push('/register')"
          class="!px-2 ml-2"
      >
        注册
      </el-button>
    </div>

    <!-- 主内容区 - 移动端卡片 -->
    <el-card
        class="mx-auto p-6"
        :style="{ maxWidth: '100%', width: mobileView ? '100%' : '400px' }"
        shadow="never"
    >
      <template #header>
        <h1 class="text-xl font-bold text-center">欢迎使用签到系统</h1>
      </template>

      <!-- 签到区域 -->
      <div v-if="!photo" class="text-center">
        <el-icon :size="60" color="#409EFF" class="mb-4">
          <Camera />
        </el-icon>

        <el-button
            type="primary"
            size="large"
            @click="takePhoto"
            :loading="isLoading"
            class="w-full !py-3"
        >
          {{ isLoading ? '准备中...' : '开始签到' }}
        </el-button>
      </div>

      <!-- 照片预览区域 -->
      <div v-else class="text-center">
        <el-image
            :src="photo"
            fit="cover"
            class="w-full h-48 mb-4 rounded-lg border border-gray-200"
        >
          <template #placeholder>
            <div class="flex items-center justify-center h-full">
              <el-icon class="is-loading" :size="24">
                <Loading />
              </el-icon>
            </div>
          </template>
        </el-image>

        <div class="flex justify-between">
          <el-button
              type="success"
              size="large"
              @click="confirmSign"
              :loading="isSubmitting"
              class="flex-1 mr-2 !py-3"
          >
            确认签到
          </el-button>
          <el-button
              size="large"
              @click="cancelSign"
              :disabled="isSubmitting"
              class="flex-1 !py-3"
          >
            取消
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 拍照对话框 - 移动端全屏 -->
    <el-dialog
        v-model="showCameraDialog"
        title="拍照签到"
        :fullscreen="mobileView"
        :style="{ maxWidth: mobileView ? '100%' : '80%' }"
        :before-close="handleCloseCamera"
    >
      <div class="camera-container">
        <video ref="videoRef" autoplay playsinline class="w-full h-full object-contain"></video>
      </div>
      <template #footer>
        <el-button @click="handleCloseCamera" size="large">取消</el-button>
        <el-button
            type="primary"
            @click="capturePhoto"
            size="large"
            class="!bg-blue-500"
        >
          拍照
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { sign } from '@/api/attendance'
import { Camera, Loading } from '@element-plus/icons-vue'
import { ElMessage, ElButton, ElCard, ElDialog, ElImage, ElIcon } from 'element-plus'

const photo = ref(null)
const isLoading = ref(false)
const isSubmitting = ref(false)
const showCameraDialog = ref(false)
const videoRef = ref(null)
const stream = ref(null)
const mobileView = ref(false)

// 检测移动端
const checkMobile = () => {
  mobileView.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  if (stream.value) {
    handleCloseCamera()
  }
})

async function takePhoto() {
  isLoading.value = true
  try {
    showCameraDialog.value = true
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // 优先使用后置摄像头
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })
    videoRef.value.srcObject = stream.value
  } catch (err) {
    ElMessage.error('获取摄像头失败: ' + (err.message || '请检查摄像头权限'))
    showCameraDialog.value = false
  } finally {
    isLoading.value = false
  }
}

function capturePhoto() {
  const canvas = document.createElement('canvas')
  const video = videoRef.value
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  photo.value = canvas.toDataURL('image/jpeg', 0.8) // 使用JPEG格式减小文件大小
  handleCloseCamera()
}

function handleCloseCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  showCameraDialog.value = false
}

async function confirmSign() {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    const blob = dataURLtoBlob(photo.value)
    formData.append('image', blob, 'photo.jpg')

    await sign(formData)
    ElMessage.success('签到成功')
    photo.value = null
  } catch (error) {
    ElMessage.error('签到失败: ' + (error.message || '请重试'))
  } finally {
    isSubmitting.value = false
  }
}

function cancelSign() {
  photo.value = null
}

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) u8arr[n] = bstr.charCodeAt(n)
  return new Blob([u8arr], {type: mime})
}
</script>

<style scoped>
.camera-container {
  width: 100%;
  height: 60vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* 移动端特定样式 */
@media (max-width: 768px) {
  .camera-container {
    height: calc(100vh - 120px); /* 对话框全屏时留出标题和按钮空间 */
  }

  :deep(.el-dialog) {
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    height: 100vh;
    border-radius: 0;
  }

  :deep(.el-dialog__header) {
    padding: 12px 20px;
  }

  :deep(.el-dialog__body) {
    padding: 0;
    flex: 1;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 20px;
  }
}

/* 按钮在移动端更大更易点击 */
@media (max-width: 480px) {
  .el-button {
    padding: 12px 0;
    font-size: 16px;
  }
}
</style>
