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
    <div v-loading="loading" style="padding: 10px">
        <div id="top-menu">
            <button type="button">添加账号</button>
            <div class="whitespace"></div>
            <button type="button" @click="logout">登出</button>
        </div>
    </div>
</template>

<style scoped>
#top-menu {
    display: flex;
    align-items: center;
    column-gap: 5px;
}

#top-menu button {
    cursor: pointer;
}

#top-menu .whitespace {
    flex: 1;
}
</style>
