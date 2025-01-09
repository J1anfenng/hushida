<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <div class="input-group">
        <input 
          type="text" 
          v-model="username" 
          placeholder="用户名"
        />
      </div>
      <div class="input-group">
        <input 
          type="password" 
          v-model="password" 
          placeholder="密码"
        />
      </div>
      <button 
        class="login-btn" 
        @click="handleLogin"
        :disabled="!username || !password"
      >
        登录
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const emit = defineEmits(['login-success'])

const handleLogin = () => {
  // 模拟登录
  localStorage.setItem('user', JSON.stringify({
    username: username.value,
    avatar: '/public/icon/icon.jpeg'
  }))
  
  // 触发登录成功事件
  emit('login-success')
  
  // 获取之前保存的路径
  const redirectPath = localStorage.getItem('redirectPath') || '/'
  localStorage.removeItem('redirectPath')
  
  router.replace(redirectPath)
}
</script>

<style scoped>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.input-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 
