<!-- LoginView.vue - 登录页面 -->
<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-4">管理员登录</h2>
    <input v-model="phone" type="text" placeholder="手机号" class="border p-2 block mb-2" />
    <input v-model="password" type="password" placeholder="密码" class="border p-2 block mb-2" />
    <button @click="loginHandler" class="bg-blue-500 text-white px-4 py-2 rounded">登录</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'

const phone = ref('')
const password = ref('')
const router = useRouter()

function loginHandler() {
  login({ phone: phone.value, password: password.value }).then(() => {
    alert('登录成功')
    router.push('/admin')
  }).catch(() => {
    alert('登录失败')
  })
}
</script>
