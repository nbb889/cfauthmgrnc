<script setup>
document.title = '管理面板'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import toast from '@/toast.js'

const loading = ref(false)
const router = useRouter()

const accounts = ref([])
const havemore = ref(false)
const morecursor = ref('')

const logout = async () => {
    loading.value = true

    const resp = await fetch('/api/auth/logout')
    toast(await resp.text())
    router.push({ name: 'login' })

    loading.value = false
}

const fetch_account = async () => {
    loading.value = true

    const resp = await fetch('/api/account/list' + (havemore.value ? `?cursor=${morecursor.value}` : ''))
    const data = await resp.json()

    accounts.value.push(...data.accounts)
    havemore.value = data.havemore
    morecursor.value = data.morecursor

    loading.value = false
}

const refresh = async () => {
    accounts.value = []
    havemore.value = false
    morecursor.value = ''
    await fetch_account()
}

onMounted(refresh)
</script>

<template>
    <div v-loading="loading" id="container">
        <div id="top-btns">
            <button type="button">添加账号</button>
            <button type="button" @click="refresh">刷新</button>
            <div class="whitespace" />
            <button type="button" @click="logout">登出</button>
        </div>
        <div id="account-list"></div>
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
    column-gap: 5px;
}

#top-btns button {
    cursor: pointer;
}

#top-btns .whitespace {
    flex: 1;
}

#account-list {
    width: calc(100% - 2 * 5px);
    margin: 5px;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
