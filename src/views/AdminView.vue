<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <el-header class="admin-header">
      <h2 class="admin-title">签到记录管理</h2>
      <el-button
          type="info"
          size="small"
          @click="logout"
          class="logout-btn"
      >
        退出登录
      </el-button>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="admin-main">
      <!-- 数据表格 -->
      <el-table
          :data="records"
          border
          stripe
          v-loading="loading"
          class="data-table"
          :height="tableHeight"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user.name" label="用户" width="120" />
        <el-table-column label="签到照片" width="120">
          <template #default="{ row }">
            <el-image
                v-if="row.photo"
                :src="row.photo"
                :preview-src-list="[row.photo]"
                fit="cover"
                class="record-photo"
                :hide-on-click-modal="true"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span v-else>无照片</span>
          </template>
        </el-table-column>
      </el-table>

    </el-main>

    <!-- 底部导航 -->
    <el-footer class="admin-footer">
      <el-menu
          mode="horizontal"
          :default-active="activeTab"
          @select="handleTabChange"
          class="footer-menu"
      >
        <el-menu-item index="records">
          <el-icon><List /></el-icon>
          <span>签到记录</span>
        </el-menu-item>
        <el-menu-item index="users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, List, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {getRecords} from "@/api/attendance";

const router = useRouter()

// 数据状态
const records = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const activeTab = ref('records')

const tableHeight = computed(() => {
  return window.innerHeight - 300 + 'px'
})

// 方法
const fetchRecords = async () => {
  try {
    loading.value = true
    // API请求
    const response = await getRecords()
    const data = await response.data
    records.value = data.items
    totalRecords.value = data.total
  } catch (error) {
    ElMessage.error('获取签到记录失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (index) => {
  activeTab.value = index
  if (index === 'users') {
    router.push('/admin/user')
  }
}

const logout = () => {
  router.push('/login')
}

// 初始化
onMounted(() => {
  fetchRecords()
  window.addEventListener('resize', () => {})
})
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409EFF;
  color: white;
  padding: 0 20px;
}

.admin-title {
  margin: 0;
  font-size: 18px;
}

.logout-btn {
  color: white;
  border-color: white;
}

.admin-main {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.data-table {
  width: 100%;
  margin-bottom: 20px;
}

.record-photo {
  width: 80px;
  height: 60px;
  cursor: pointer;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 60px;
  background-color: #f5f5f5;
  color: #999;
}

.admin-footer {
  padding: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer-menu{
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

/* 移动端适配 */
@media (max-width: 500px) {
  .admin-header {
    padding: 0 10px;
  }

  .data-table {
    font-size: 14px;
  }

  .footer-menu {
    flex-direction: row;
    justify-content: space-around;
  }

  .footer-menu .el-menu-item{
    padding: 0 5px;
    font-size: 12px;
  }

  .footer-menu .el-icon {
    margin-right: 0;
  }
}
</style>
