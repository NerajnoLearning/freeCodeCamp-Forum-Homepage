<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ForumTopicCard from '../components/ForumTopicCard.vue'
import type { ForumTopic, ForumUser } from '@/types'
import { forumApiService, getErrorMessage } from '@/services'

const topics = ref<ForumTopic[]>([])
const users = ref<ForumUser[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const controller = new AbortController()

const fetchTopics = async (): Promise<void> => {
  loading.value = true
  error.value = null

  try {
    const data = await forumApiService.fetchLatestTopics({
      signal: controller.signal,
    })
    topics.value = data.topic_list.topics
    users.value = data.users
  } catch (err) {
    error.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTopics)

onUnmounted(() => {
  controller.abort()
})

const getUser = (id: number): ForumUser | undefined => users.value.find((user) => user.id === id)
</script>

<template>
  <main class="p-4 max-w-4xl mx-auto">
    <div v-if="loading" class="text-center text-gray-500 mt-10">Loading topics ...</div>

    <div v-else-if="error" class="text-center text-red-500 mt-10">Error: {{ error }}</div>

    <forum-topic-card v-for="topic in topics" :key="topic.id" :topic="topic" :get-user="getUser" />
  </main>
</template>
