<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ForumTopicCard from '../components/ForumTopicCard.vue'
import type { ForumTopic, ForumUser, ForumApiResponse } from '@/types'

const topics = ref<ForumTopic[]>([])
const users = ref<ForumUser[]>([])

const fetchTopics = async (): Promise<void> => {
  const res = await fetch('https://forum-proxy.freecodecamp.rocks/latest')
  const data: ForumApiResponse = await res.json()
  topics.value = data.topic_list.topics
  users.value = data.users
}

onMounted(fetchTopics)

const getUser = (id: number): ForumUser | undefined => users.value.find((user) => user.id === id)
</script>

<template>
  <main class="p-4 max-w-4xl mx-auto">
    <div v-if="topics.length === 0" class="text-center text-gray-500 mt-10">Loading topics ...</div>

    <forum-topic-card v-for="topic in topics" :key="topic.id" :topic="topic" :get-user="getUser" />
  </main>
</template>
