<script setup>
    const props = defineProps({
        user: Object,
    })

    const avatarUrl = props.user
        ? props.user?.avatar_template?.replace("{size}", "40")
        : "";

</script>

<template>
    <a
        v-if="user"
        :href="`https://forum.freecodecamp.org/u/${user.username}`"
        target="_blank"
        >
            <img
                :src="avatarUrl"
                class="w-8 h-8 rounded-full border"
                :alt="user.username"
                :title="user.username"
            />
    </a>
</template>