<!-- RegisterView.vue - 注册页面 -->
<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-4">管理员注册</h2>
    <input v-model="phone" type="text" placeholder="手机号" class="border p-2 block mb-2" />
    <input v-model="password" type="password" placeholder="密码" class="border p-2 block mb-2" />
    <button @click="registerHandler" class="bg-green-500 text-white px-4 py-2 rounded">注册</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/user'

const phone = ref('')
const password = ref('')
const router = useRouter()

function registerHandler() {
  register({ phone: phone.value, password: password.value }).then(() => {
    alert('注册成功')
    router.push('/login')
  }).catch(() => {
    alert('注册失败')
  })
}
</script>
