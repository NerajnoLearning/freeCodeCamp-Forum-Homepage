<script setup lang="ts">
import { computed } from 'vue'
import type { ForumUser } from '@/types'

interface Props {
  user?: ForumUser
}

const props = defineProps<Props>()

const avatarUrl = computed(() =>
  props.user ? props.user.avatar_template.replace('{size}', '40') : ''
)
</script>

<template>
  <a v-if="user" :href="`https://forum.freecodecamp.org/u/${user.username}`" target="_blank">
    <img
      :src="avatarUrl"
      class="w-8 h-8 rounded-full border"
      :alt="user.username"
      :title="user.username"
    />
  </a>
</template>
