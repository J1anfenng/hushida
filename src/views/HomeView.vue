<template>
  <div class="home">
    <!-- 顶部选项卡 -->
    <div class="tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-item', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
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

<script>
import Map from '../components/Map.vue'

export default {
  name: 'HomeView',
  components: {
    Map
  },
  data() {
    return {
      currentTab: 'map',
      tabs: [
        { id: 'map', name: '地图' },
        { id: 'circle', name: '师大圈' },
        { id: 'personal', name: '我的' }
      ]
    }
  },
  computed: {
    currentComponent() {
      switch (this.currentTab) {
        case 'map':
          return 'Map'
        case 'circle':
          return 'Circle'
        case 'personal':
          return 'Personal'
        default:
          return 'Map'
      }
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
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
}
</style>
