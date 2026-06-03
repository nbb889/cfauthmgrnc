<script setup>
document.title = '管理面板'

import { ref, onMounted, computed, reactive } from 'vue'
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

const in_editor = ref(false)
const form_name = ref('')
const form_data = reactive({
    username: '',
    password: '',
    totp: '',
    note: ''
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

const fetch_account_info = async account => {
    loading.value = true

    const resp = await fetch(`/api/account/info?name=${account}`)
    form_name.value = account
    Object.assign(form_data, await resp.json())

    loading.value = false
}

const set_account_info = async () => {
    loading.value = true

    const resp = await fetch(`/api/account/set?name=${form_name.value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(form_data)
    })

    toast(await resp.text())
    loading.value = false

    if (resp.ok) {
        in_editor.value = false
        await refresh()
    }
}

const add_account = () => {
    form_name.value = ''
    Object.assign(form_data, {
        username: '',
        password: '',
        totp: '',
        note: ''
    })

    in_editor.value = true
}

const view_account = async (event, account) => {
    if (!event.target.open) return
    await fetch_account_info(account)
}

const edit_account = async account => {
    await fetch_account_info(account)
    in_editor.value = true
}

const del_account = async account => {
    loading.value = true

    const resp = await fetch(`/api/account/del?name=${account}`)
    toast(await resp.text())

    loading.value = false
    await refresh()
}

const refresh = async () => {
    accounts.value = []
    havemore.value = false
    morecursor.value = ''
    await fetch_account_list()
}

onMounted(refresh)

import modal from '@/components/modal.vue'
import totp from '@/components/totp.vue'
</script>

<template>
    <modal v-if="in_editor">
        <template #title>
            <span>配置编辑器</span>
        </template>
        <template #content>
            <form id="form" v-loading="loading">
                <div>
                    <label for="name">配置名称</label>
                    <input type="text" id="name" v-model="form_name" />
                </div>
                <div>
                    <label for="username">用户名</label>
                    <input type="text" id="username" v-model="form_data.username" />
                </div>
                <div>
                    <label for="password">密码</label>
                    <input type="text" id="password" v-model="form_data.password" />
                </div>
                <div>
                    <label for="totp">TOTP (可选)</label>
                    <input type="text" id="totp" v-model="form_data.totp" />
                </div>
                <div>
                    <label for="note">备注 (可选)</label>
                    <input type="text" id="note" v-model="form_data.note" />
                </div>
                <div id="form-btns">
                    <button type="button" @click="in_editor = false">取消</button>
                    <button type="button" @click="set_account_info">完成</button>
                </div>
            </form>
        </template>
    </modal>
    <div v-show="!in_editor" v-loading="loading" id="container">
        <div id="top-btns">
            <button type="button" @click="add_account">添加账号</button>
            <button type="button" @click="refresh">刷新</button>
            <div class="whitespace" />
            <input type="text" placeholder="查找" v-model="filter" />
            <div class="whitespace" />
            <button type="button" @click="logout">登出</button>
        </div>
        <div id="account-list">
            <div id="account-list-wrapper"></div>
            <details v-for="account in filtered_accounts" :key="account" @toggle="view_account($event, account)">
                <summary>
                    <div class="summary-content">
                        <span>{{ account }}</span>
                        <button type="button" @click="edit_account(account)">编辑</button>
                        <button type="button" @click="del_account(account)">删除</button>
                    </div>
                </summary>
                <div class="account-details">
                    <div>
                        <span>用户名</span>
                        <code>{{ form_data.username }}</code>
                    </div>
                    <div>
                        <span>密码</span>
                        <code>{{ form_data.password }}</code>
                    </div>
                    <div>
                        <span>TOTP</span>
                        <code><totp :secret="form_data.totp" /></code>
                    </div>
                    <div>
                        <span>备注</span>
                        <code>{{ form_data.note }}</code>
                    </div>
                </div>
            </details>
            <div v-if="havemore" id="loadmore-container">
                <button type="button" @click="fetch_account_list">加载更多</button>
            </div>
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

#top-btns .whitespace {
    flex: 1;
}

#form input {
    float: right;
}

#form-btns {
    width: 100%;
    margin: 2px 0;
    display: flex;
    align-items: center;
    column-gap: 5px;
}

#form-btns button {
    flex: 1;
}

#account-list {
    width: calc(100% - 2 * 5px);
    margin: 5px;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
}

#account-list-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 10px;
}

#account-list-wrapper * {
    height: min-content;
}

#account-list-wrapper details {
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    padding: 10px;
    height: fit-content;
    transition: all 0.3s ease;
}

#account-list-wrapper summary {
    font-weight: bold;
    outline: none;
    user-select: none;
}

#account-list-wrapper .summary-content {
    display: inline-flex;
    align-items: center;
    column-gap: 5px;
}

#account-list-wrapper .account-details {
    margin-top: 10px;
}

#account-list-wrapper .account-details code {
    float: right;
    font-size: large;
}

#loadmore-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
