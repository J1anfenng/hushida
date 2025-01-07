<template>
  <div class="home">
    <!-- 顶部选项卡 -->
    <div class="tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-item', { active: isActive(tab.id) }]"
        @click="navigateTo(tab.id)"
      >
        {{ tab.name }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = ref([
  { id: 'map', name: '地图', path: '/' },
  { id: 'circle', name: '师大圈', path: '/circle' },
  { id: 'personal', name: '我的', path: '/personal' }
])

const isActive = (tabId: string) => {
  const path = route.path
  if (tabId === 'map' && (path === '/' || path.startsWith('/location'))) {
    return true
  }
  return path === `/${tabId}`
}

const navigateTo = (tabId: string) => {
  const tab = tabs.value.find(t => t.id === tabId)
  if (tab) {
    router.push(tab.path)
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.tab-item {
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item:hover {
  background-color: #e8e8e8;
}

.tab-item.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.content {
  flex: 1;
  position: relative;
  padding: 0;
  overflow: hidden;
}
</style>
