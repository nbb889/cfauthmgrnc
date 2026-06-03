<script setup>
document.title = '正在加载...'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import toast from '@/toast.js'

const wait_backend_ack = ref(true)
const backend_is_ok = ref(false)
const backend_error = ref('')

const wait_auth_status = ref(true)
const router = useRouter()

onMounted(async () => {
    try {
        const resp = await fetch('/api/ping')

        if (!resp.ok) {
            backend_is_ok.value = false
            backend_error.value = await resp.text()
            return
        }

        backend_is_ok.value = true
    } finally {
        wait_backend_ack.value = false
    }

    try {
        const resp = await fetch('/api/auth/status')
        toast(await resp.text())

        if (!resp.ok) {
            router.push({ name: 'login' })
            return
        }

        router.push({ name: 'dash' })
    } finally {
        wait_auth_status.value = false
    }
})

import modal from '@/components/modal.vue'
</script>

<template>
    <router-view v-if="backend_is_ok && !wait_auth_status" />
    <modal v-else>
        <template #title>
            <span class="modal-title">后端配置验证器</span>
        </template>
        <template #content>
            <span v-if="wait_backend_ack">正在验证后端配置...</span>
            <div v-else>
                <span v-if="backend_is_ok">后端配置成功, 正在加载...</span>
                <span v-else>后端返回了错误: {{ backend_error }}</span>
            </div>
        </template>
    </modal>
</template>

<style scoped></style>
