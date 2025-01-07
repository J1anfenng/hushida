<template>
  <div class="personal-container">
    <!-- 用户信息头部 -->
    <div class="user-header">
      <img :src="userInfo.avatar" class="user-avatar" />
      <h2 class="username">{{ userInfo.name }}</h2>
      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.posts }}</div>
          <div class="stat-label">动态</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.followers }}</div>
          <div class="stat-label">关注者</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.following }}</div>
          <div class="stat-label">关注</div>
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="function-list">
      <div class="function-item" v-for="item in functionItems" :key="item.id">
        <Icon :icon="item.icon" class="function-icon" />
        <span class="function-name">{{ item.name }}</span>
        <Icon icon="mdi:chevron-right" class="arrow-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const userInfo = ref({
  name: '师大同学',
  avatar: '/avatars/default.png',
  posts: 12,
  followers: 56,
  following: 34
})

const functionItems = ref([
  { id: 1, name: '我的收藏', icon: 'mdi:star-outline' },
  { id: 2, name: '浏览历史', icon: 'mdi:history' },
  { id: 3, name: '系统设置', icon: 'mdi:cog-outline' },
  { id: 4, name: '关于我们', icon: 'mdi:information-outline' }
])
</script>

<style scoped>
.personal-container {
  background-color: #f5f5f5;
  min-height: 100%;
}

.user-header {
  background: white;
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.username {
  margin: 0 0 16px 0;
  color: #333;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding: 0 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.function-list {
  margin-top: 12px;
  background: white;
}

.function-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.function-item:active {
  background-color: #f5f5f5;
}

.function-icon {
  font-size: 20px;
  color: #666;
  margin-right: 12px;
}

.function-name {
  flex: 1;
  color: #333;
}

.arrow-icon {
  color: #999;
}
</style> 