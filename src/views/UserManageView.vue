<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <el-header class="admin-header">
      <h2 class="admin-title">用户管理</h2>
      <div class="header-actions">
        <el-button
            type="primary"
            size="small"
            @click="showAddUserDialog"
            :icon="Plus"
        >
          添加用户
        </el-button>
        <el-button
            type="info"
            size="small"
            @click="logout"
            class="logout-btn"
        >
          退出登录
        </el-button>
      </div>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="admin-main">
      <!-- 数据表格 -->
      <el-table
          :data="users"
          border stripe
          v-loading="loading"
          class="data-table"
          :height="tableHeight"
      >
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="150" />
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

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
        v-model="userDialogVisible"
        :title="dialogTitle"
        width="80%"
    >
      <el-form
          :model="userForm"
          :rules="userRules"
          ref="userFormRef"
          label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="userForm.role">
            <el-radio label="user">普通用户</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="registerUser" :loading="submitting">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {List, Plus, Search, User} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {getUsers} from "@/api/user";

const router = useRouter()

// 数据状态
const users = ref([])
const loading = ref(false)
const submitting = ref(false)
const totalUsers = ref(0)
const activeTab = ref('users')
const userDialogVisible = ref(false)
const dialogTitle = ref('添加用户')
const userFormRef = ref(null)

// 表单数据
const userForm = ref({
  name: '',
  phone: ''
})

// 注册表单验证规则
const userRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
}

const tableHeight = computed(() => {
  return window.innerHeight - 300 + 'px'
})

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    // 模拟API请求
    const response = await getUsers()
    const data = await response.data
    users.value = data.items
    totalUsers.value = data.total
  } catch (error) {
    ElMessage.error('获取用户列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

const showAddUserDialog = () => {
  dialogTitle.value = '添加用户'
  userForm.value = {
    name: '',
    phone: '',
    department: '',
    role: 'user'
  }
  userDialogVisible.value = true
}

const registerUser = async () => {
  //TODO:
}

const handleTabChange = (index) => {
  activeTab.value = index
  if (index === 'records') {
    router.push('/admin')
  }
}

const logout = () => {
  router.push('/login')
}

// 初始化
onMounted(() => {
  fetchUsers()
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

.header-actions {
  display: flex;
  gap: 10px;
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
