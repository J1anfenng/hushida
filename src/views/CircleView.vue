<template>
  <div class="circle-container">
    <!-- 添加一个滚动容器 -->
    <div class="scroll-container">
      <div class="content-list">
        <div v-for="post in posts" :key="post.id" class="post-card">
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
            <div class="action-item">
              <Icon icon="mdi:share-outline" /> 分享
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论抽屉 -->
    <div 
      class="comments-drawer"
      :class="{ 'open': showComments }"
    >
      <div class="drawer-header">
        <h3>评论 ({{ currentPost?.comments || 0 }})</h3>
        <button class="close-btn" @click="showComments = false">
          <Icon icon="mdi:close" />
        </button>
      </div>
      <div class="comments-list">
        <div v-for="comment in commentsList" :key="comment.id" class="comment-item">
          <img :src="comment.avatar" class="comment-avatar" />
          <div class="comment-content">
            <div class="comment-user">{{ comment.username }}</div>
            <div class="comment-text">{{ comment.content }}</div>
            <div class="comment-time">{{ comment.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

interface Post {
  id: number
  username: string
  avatar: string
  time: string
  content: string
  images: string[]
  likes: number
  comments: number
  isLiked?: boolean
}

const posts = ref<Post[]>([
  {
    id: 1,
    username: '师大学子',
    avatar: '/public/icon/icon.jpeg',
    time: '10分钟前',
    content: '今天在图书馆学习，感觉氛围真好！',
    images: ['/public/icon/icon.jpeg'],
    likes: 23,
    comments: 5,
    isLiked: false
  },
  {
    id: 2,
    username: '校园达人',
    avatar: '/avatars/default2.png',
    time: '1小时前',
    content: '木兰公寓的樱花开了，大家快来看啊！',
    images: ['/images/cherry.jpg', '/images/cherry2.jpg'],
    likes: 45,
    comments: 12
  },
  {
    id: 3,
    username: '校园达人',
    avatar: '/avatars/default2.png',
    time: '2小时前',
    content: '今天的晚霞真美！',
    images: ['/images/cherry.jpg'],
    likes: 38,
    comments: 8
  },
  {
    id: 4,
    username: '师大新生',
    avatar: '/avatars/default2.png',
    time: '3小时前',
    content: '第一次来到师大，校园真大啊！',
    images: ['/images/cherry.jpg'],
    likes: 56,
    comments: 15
  }
])

const showComments = ref(false)
const currentPost = ref<Post | null>(null)

// 模拟评论数据
const commentsList = ref([
  {
    id: 1,
    username: '同学A',
    avatar: '/public/icon/icon.jpeg',
    content: '图书馆确实很安静！',
    time: '5分钟前'
  },
  {
    id: 2,
    username: '同学B',
    avatar: '/public/icon/icon.jpeg',
    content: '我也经常去那里学习',
    time: '3分钟前'
  }
])

const toggleLike = (post: Post) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const openComments = (post: Post) => {
  currentPost.value = post
  showComments.value = true
}
</script>

<style scoped>
.circle-container {
  height: 100%;
  background-color: #f5f5f5;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.content-list {
  padding: 16px;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.username {
  font-weight: 500;
  color: #333;
}

.post-time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.post-content {
  margin-bottom: 12px;
  line-height: 1.5;
  color: #333;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.post-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-item:hover {
  background-color: #f5f5f5;
}

.post-card:last-child {
  margin-bottom: 48px;
}

.action-item.liked {
  color: #1890ff;
}

.comments-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 400px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: 1000;
}

.comments-drawer.open {
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
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 4px;
}

.comments-list {
  padding: 16px;
  overflow-y: auto;
  height: calc(100% - 53px);
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-weight: 500;
  margin-bottom: 4px;
}

.comment-text {
  color: #333;
  margin-bottom: 4px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}
</style> 