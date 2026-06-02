<script setup>
document.title = '正在加载...'
import { ref, onMounted } from 'vue'

const wait_backend_ack = ref(true)
const backend_is_ok = ref(false)
const backend_error = ref('')

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
})
</script>

<template>
    <div class="container">
        <div class="modal">
            <span class="modal-title">后端配置验证器</span>
            <span v-if="wait_backend_ack">正在验证后端配置...</span>
            <span v-if="backend_is_ok">后端配置成功, 正在加载...</span>
            <span v-if="!backend_is_ok">后端返回了错误: {{ backend_error }}</span>
        </div>
    </div>
    <router-view v-if="backend_is_ok" />
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    border: 1px solid black;
    padding: 10px;
    position: relative;
    min-width: 250px;
}

.modal-title {
    position: absolute;
    top: 0;
    left: 5px;
    transform: translateY(-50%);
    padding: 0 5px;
    background-color: white;
}
</style>
