<template>
  <div class="location-detail">
    <div class="header">
      <button class="back-button" @click="router.back()">
        <Icon icon="mdi:arrow-left" /> 返回
      </button>
      <h1>{{ location?.name }}</h1>
    </div>

    <div class="content">
      <div class="main-image">
        <img :src="location?.image" :alt="location?.name">
      </div>

      <div class="info-section">
        <h2>地点介绍</h2>
        <p>{{ location?.description }}</p>
      </div>

      <div class="comments-section">
        <h2>访客评论</h2>
        <div class="comment-form">
          <textarea 
            v-model="newComment" 
            placeholder="写下你的评论..."
          ></textarea>
          <button @click="addComment">发表评论</button>
        </div>

        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <span class="username">{{ comment.username }}</span>
              <span class="time">{{ comment.time }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { Location, Comment } from '../types'

const route = useRoute()
const router = useRouter()
const location = ref<Location | null>(null)
const comments = ref<Comment[]>([
  {
    id: "1",
    username: "张同学",
    time: "2024-03-15 14:30",
    content: "图书馆环境很好，自习室经常爆满，建议早点来占座。"
  },
  {
    id: "2", 
    username: "李同学",
    time: "2024-03-14 16:20",
    content: "一楼的借阅大厅藏书很丰富，工作人员服务态度也很好。"
  },
  {
    id: "3",
    username: "王老师",
    time: "2024-03-13 09:45", 
    content: "图书馆的电子资源非常全面，对教学科研很有帮助。"
  },
  {
    id: "4",
    username: "刘同学",
    time: "2024-03-12 20:15",
    content: "晚上自习的时候环境安静，空调温度也很舒适。"
  }
])
const newComment = ref('')

onMounted(async () => {
  // 这里需要根据 route.params.id 获取位置详情
  // 实际项目中应该从API获取数据
})

const addComment = () => {
  if (!newComment.value.trim()) return
  
  comments.value.unshift({
    id: String(comments.value.length + 1),
    username: "访客用户", // 这里可以替换为实际的用户名
    time: new Date().toLocaleString(),
    content: newComment.value
  })
  
  newComment.value = ""
}
</script>

<style scoped>
.location-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
}

.main-image img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 12px;
}

.info-section, .comments-section {
  margin-top: 30px;
}

.comment-form {
  margin: 20px 0;
}

.comment-form textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}

.comment {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.username {
  font-weight: bold;
}

.time {
  color: #666;
  font-size: 0.9em;
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style> 