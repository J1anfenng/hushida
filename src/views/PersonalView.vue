<template>
  <div class="personal-container">
    <!-- 用户信息头部 -->
    <div class="user-header">
      <img :src="userInfo.avatar" class="user-avatar" />
      <h2 class="username">{{ userInfo.name }}</h2>
      <div class="user-stats">
        <div 
          class="stat-item"
          :class="{ active: currentTab === 'posts' }"
          @click="switchTab('posts')"
        >
          <div class="stat-value">{{ userInfo.posts }}</div>
          <div class="stat-label">动态</div>
        </div>
        <div 
          class="stat-item"
          :class="{ active: currentTab === 'followers' }"
          @click="switchTab('followers')"
        >
          <div class="stat-value">{{ userInfo.followers }}</div>
          <div class="stat-label">粉丝</div>
        </div>
        <div 
          class="stat-item"
          :class="{ active: currentTab === 'following' }"
          @click="switchTab('following')"
        >
          <div class="stat-value">{{ userInfo.following }}</div>
          <div class="stat-label">关注</div>
        </div>
        <div 
          class="stat-item"
          :class="{ active: currentTab === 'collections' }"
          @click="switchTab('collections')"
        >
          <div class="stat-value">{{ userInfo.collections }}</div>
          <div class="stat-label">收藏</div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <div class="scroll-container">
        <!-- 动态列表 -->
        <div v-if="currentTab === 'posts'" class="tab-content">
          <div v-for="post in userPosts" :key="post.id" class="post-card">
            <div class="post-header">
              <img :src="post.avatar" class="avatar" />
              <div class="user-info">
                <div class="username">{{ post.username }}</div>
                <div class="post-time">{{ post.time }}</div>
              </div>
            </div>
            <div class="post-content">{{ post.content }}</div>
            <div class="post-actions">
              <div 
                class="action-item"
                :class="{ 'liked': post.isLiked }"
                @click="toggleLike(post)"
              >
                <Icon :icon="post.isLiked ? 'mdi:thumb-up' : 'mdi:thumb-up-outline'" /> 
                {{ post.likes }}
              </div>
              <div 
                class="action-item"
                @click="openComments(post)"
              >
                <Icon icon="mdi:comment-outline" /> {{ post.comments }}
              </div>
              <div 
                v-if="post.images?.length"
                class="action-item"
                @click="openImageViewer(post.images)"
              >
                <Icon icon="mdi:image" /> {{ post.images.length }}
              </div>
              <div 
                class="action-item"
                :class="{ 'collected': post.isCollected }"
                @click="toggleCollect(post)"
              >
                <Icon :icon="post.isCollected ? 'mdi:star' : 'mdi:star-outline'" /> 
                {{ post.isCollected ? '已收藏' : '收藏' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 粉丝列表 -->
        <div v-if="currentTab === 'followers'" class="tab-content">
          <div v-for="user in followers" :key="user.id" class="user-item">
            <img :src="user.avatar" class="user-item-avatar" />
            <div class="user-item-info">
              <div class="user-item-name">{{ user.name }}</div>
              <div class="user-item-bio">{{ user.bio }}</div>
            </div>
            <button 
              class="follow-btn"
              :class="{ following: user.isFollowing }"
              @click="toggleFollow(user)"
            >
              {{ user.isFollowing ? '已关注' : '关注' }}
            </button>
          </div>
        </div>

        <!-- 关注列表 -->
        <div v-if="currentTab === 'following'" class="tab-content">
          <div v-for="user in following" :key="user.id" class="user-item">
            <img :src="user.avatar" class="user-item-avatar" />
            <div class="user-item-info">
              <div class="user-item-name">{{ user.name }}</div>
              <div class="user-item-bio">{{ user.bio }}</div>
            </div>
            <button 
              class="follow-btn following"
              @click="toggleFollow(user)"
            >
              已关注
            </button>
          </div>
        </div>

        <!-- 收藏列表 -->
        <div v-if="currentTab === 'collections'" class="tab-content">
          <div v-for="post in collections" :key="post.id" class="post-card">
            <div class="post-header">
              <img :src="post.avatar" class="avatar" />
              <div class="user-info">
                <div class="username">{{ post.username }}</div>
                <div class="post-time">{{ post.time }}</div>
              </div>
            </div>
            <div class="post-content">{{ post.content }}</div>
            <div class="post-images" v-if="post.images && post.images.length">
              <img 
                v-for="(image, index) in post.images" 
                :key="index" 
                :src="image" 
                class="post-image"
              />
            </div>
            <div class="post-actions">
              <div 
                class="action-item"
                :class="{ 'liked': post.isLiked }"
                @click="toggleLike(post)"
              >
                <Icon :icon="post.isLiked ? 'mdi:thumb-up' : 'mdi:thumb-up-outline'" /> 
                {{ post.likes }}
              </div>
              <div 
                class="action-item"
                @click="openComments(post)"
              >
                <Icon icon="mdi:comment-outline" /> {{ post.comments }}
              </div>
              <div 
                v-if="post.images?.length"
                class="action-item"
                @click="openImageViewer(post.images)"
              >
                <Icon icon="mdi:image" /> {{ post.images.length }}
              </div>
              <div 
                class="action-item collected"
                @click="removeCollection(post)"
              >
                <Icon icon="mdi:star" /> 已收藏
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加图片查看器组件 -->
    <ImageDialog
      v-model:show="showImageViewer"
      :images="currentImages"
      :initial-index="currentImageIndex"
      @close="closeImageViewer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import ImageDialog from '../components/ImageDialog.vue'

const currentTab = ref('posts')  // 默认显示动态

const switchTab = (tab: string) => {
  currentTab.value = tab
}

const userInfo = ref({
  name: '师大同学',
  avatar: '/avatars/default.png',
  posts: 12,
  followers: 56,
  following: 34,
  collections: 8
})

// 用户动态数据
const userPosts = ref([
  {
    id: 1,
    username: '师大同学',
    avatar: '/public/icon/icon.jpeg',
    content: '今天在图书馆学习，感觉氛围真好！',
    images: ['/public/icon/icon.jpeg'],
    time: '2小时前',
    likes: 23,
    comments: 5,
    isLiked: false,
    isCollected: false
  }
])

// 粉丝数据
const followers = ref([
  {
    id: 1,
    name: '张同学',
    avatar: '/avatars/default.png',
    bio: '师大计算机系学生',
    isFollowing: true
  },
  // ... 更多粉丝
])

// 关注数据
const following = ref([
  {
    id: 1,
    name: '李同学',
    avatar: '/avatars/default.png',
    bio: '热爱摄影的师大学子',
    isFollowing: true
  },
  // ... 更多关注
])

// 添加收藏数据
const collections = ref([
  {
    id: 1,
    username: '校园达人',
    avatar: '/public/icon/icon.jpeg',
    content: '逸夫图书馆是一座现代化的多功能图书馆，建筑面积达50,000平方米...',
    images: ['/public/icon/icon.jpeg'],
    time: '2024-03-15',
    likes: 45,
    comments: 12,
    isLiked: false,
    isCollected: true
  }
])

const removeCollection = (post: any) => {
  userInfo.value.collections--
  const index = collections.value.findIndex(p => p.id === post.id)
  if (index > -1) {
    collections.value.splice(index, 1)
  }
}

// 关注/取消关注
const toggleFollow = (user: any) => {
  user.isFollowing = !user.isFollowing
}

// 添加交互方法
const toggleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const openComments = (post: any) => {
  // TODO: 实现评论功能
}

const toggleCollect = (post: any) => {
  post.isCollected = !post.isCollected
  if (post.isCollected) {
    userInfo.value.collections++
    collections.value.unshift(post)
  } else {
    userInfo.value.collections--
    const index = collections.value.findIndex(p => p.id === post.id)
    if (index > -1) {
      collections.value.splice(index, 1)
    }
  }
}

// 添加图片查看器状态
const showImageViewer = ref(false)
const currentImages = ref<string[]>([])
const currentImageIndex = ref(0)

// 添加图片查看器方法
const openImageViewer = (images: string[]) => {
  currentImages.value = images
  currentImageIndex.value = 0
  showImageViewer.value = true
}

const closeImageViewer = () => {
  showImageViewer.value = false
}
</script>

<style scoped>
.personal-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
}

.user-header {
  flex-shrink: 0;  /* 防止头部被压缩 */
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
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
}

.stat-item.active {
  background-color: #e6f7ff;
}

.stat-item.active .stat-value {
  color: #1890ff;
}

.content-area {
  flex: 1;
  overflow: hidden;
  padding: 8px;
}

.scroll-container {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 16px;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.post-time {
  font-size: 12px;
  color: #999;
  margin-top: 1px;
}

.post-content {
  margin-bottom: 8px;
  line-height: 1.5;
  font-size: 14px;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.post-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
  font-size: 13px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.action-item:hover {
  background-color: #f5f5f5;
}

.action-item.liked {
  color: #1890ff;
}

.action-item.collected {
  color: #faad14;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.user-item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-item-info {
  flex: 1;
}

.user-item-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.user-item-bio {
  font-size: 12px;
  color: #999;
}

.follow-btn {
  padding: 6px 16px;
  border-radius: 4px;
  border: 1px solid #1890ff;
  background: white;
  color: #1890ff;
  cursor: pointer;
}

.follow-btn.following {
  background: #f5f5f5;
  border-color: #d9d9d9;
  color: #666;
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 998;
}

.drawer-overlay.show {
  opacity: 1;
  visibility: visible;
}

.content-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  background: white;
  transition: right 0.3s;
  z-index: 999;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .content-drawer {
    width: 500px;
  }
}

.content-drawer.open {
  right: 0;
}

.drawer-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
}

.collection-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
  background: white;
}

.collection-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.collection-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.collection-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.collection-time {
  font-size: 12px;
  color: #999;
}

.uncollect-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.uncollect-btn:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

/* 优化滚动条样式 */
.scroll-container::-webkit-scrollbar {
  width: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style> 