<script setup>
    import { ref, onMounted } from "vue";
    import ForumTopicCard from "../components/ForumTopicCard.vue";

    const topics = ref([]);
    const users = ref([]);

    const fetchTopics = async () => {
        const res = await fetch("https://forum-proxy.freecodecamp.rocks/latest");
        const data = await res.json();
        topics.value = data.topic_list.topics;
        users.value = data.users;
    };

    onMounted(fetchTopics);

    const getUser = (id) => users.value.find((user) => user.id === id);
</script>

<template>
    <main class="p-4 max-w-4xl mx-auto">
        <div v-if="topics.length === 0" class="text-center text-gray-500 mt-10">
            Loading topics ...
        </div>

        <ForumTopicCard 
            v-for="topic in topics"
            :key="topic.id"
            :topic="topic"
            :getUser="getUser"
        />
    </main>
</template>