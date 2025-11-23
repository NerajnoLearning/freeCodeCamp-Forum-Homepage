<script setup>
    import UserAvatar from "./UserAvatar.vue"
    const props = defineProps({
        topic: Object,
        getUser: Function,
    })

    const formatDate = (date) => 
        new Date(date).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        })
</script>

<template>
    <div class="bg-white p-4 rounded-xl mb-4 hover:shadow-lg transition">
        <a
            class="text-lg font-medium text-green-700 hover:underline"
            :href="`https://forum.freecodecamp.org/t/${topic.id}`"
            target="_blank">
            {{ topic.title }}
        </a>

        <div class="flex items-center gap-3 mt-3 flex-wrap">
            <UserAvatar
             v-for="poster in topic.posters"
             :key="poster.user_id"
             :user="getUser(poster.user_id)"
            /> 
        </div>

        <div class="grid grid-cols-3 mt-4 text-sm text-gray-700">
            <div><strong>{{ topic.reply_count }}</strong> replies</div>
            <div><strong>{{ topic.views }}</strong> views</div>
            <div>Last active: {{ formatDate(topic.last_posted_at) }}</div>
        </div>
    </div>
    <br />
</template>