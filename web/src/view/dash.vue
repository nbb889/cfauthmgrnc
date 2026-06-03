<script setup>
document.title = '管理面板'

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import toast from '@/toast.js'

const loading = ref(false)
const router = useRouter()

const accounts = ref([])
const havemore = ref(false)
const morecursor = ref('')

const filter = ref('')
const filtered_accounts = computed(() => {
    if (!filter.value.trim()) return accounts.value
    const keyword = filter.value.toLowerCase()
    return accounts.value.filter(account => account.toLowerCase().includes(keyword))
})

const logout = async () => {
    loading.value = true

    const resp = await fetch('/api/auth/logout')
    toast(await resp.text())
    router.push({ name: 'login' })

    loading.value = false
}

const fetch_account_list = async () => {
    loading.value = true

    const resp = await fetch('/api/account/list' + (havemore.value ? `?cursor=${morecursor.value}` : ''))
    const data = await resp.json()

    accounts.value.push(...data.accounts)
    havemore.value = data.havemore
    morecursor.value = data.morecursor

    loading.value = false
}

const fetch_account_info = async (event, account) => {
    if (!event.target.open) return
    console.log(event, account)
}

const refresh = async () => {
    accounts.value = []
    havemore.value = false
    morecursor.value = ''
    await fetch_account_list()
}

onMounted(refresh)
</script>

<template>
    <div v-loading="loading" id="container">
        <div id="top-btns">
            <button type="button">添加账号</button>
            <button type="button" @click="refresh">刷新</button>
            <div class="whitespace" />
            <input type="text" placeholder="查找" v-model="filter" />
            <div class="whitespace" />
            <button type="button" @click="logout">登出</button>
        </div>
        <div id="account-list">
            <details v-for="account in filtered_accounts" :key="account" @toggle="fetch_account_info($event, account)">
                <summary>{{ account }}</summary>
            </details>
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 10px;
}

#account-list details {
    border: 1px solid #dddddd;
    border-radius: 4px;
    padding: 10px;
    background-color: #ffffff;
    height: fit-content;
    transition: all 0.3s ease;
}

#account-list summary {
    font-weight: bold;
    cursor: pointer;
    outline: none;
    user-select: none;
}

.account-details {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px collapse #eeeeee;
    color: #666666;
}
</style>
