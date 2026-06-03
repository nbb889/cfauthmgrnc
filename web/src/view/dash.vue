<script setup>
document.title = '管理面板'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import toast from '@/toast.js'

const loading = ref(false)
const router = useRouter()

const logout = async () => {
    loading.value = true

    const resp = await fetch('/api/auth/logout')
    toast(await resp.text())
    router.push({ name: 'login' })

    loading.value = false
}
</script>

<template>
    <div v-loading="loading" id="container">
        <div id="top-btns">
            <button type="button">添加账号</button>
            <div class="whitespace" />
            <button type="button" @click="logout">登出</button>
        </div>
    </div>
</template>

<style scoped>
#container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#top-btns {
    width: calc(100% - 2 * 5px);
    margin: 5px;
    display: flex;
    align-items: center;
}

#top-btns button {
    cursor: pointer;
}

#top-btns .whitespace {
    flex: 1;
}
</style>
