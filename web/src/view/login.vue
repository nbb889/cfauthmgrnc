<script setup>
document.title = '统一登录'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import toast from '@/toast.js'

const password = ref('')
const logining = ref(false)
const router = useRouter()

const do_login = async () => {
    logining.value = true

    try {
        const resp = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                password: password.value
            })
        })

        toast(await resp.text())
        if (!resp.ok) return
        router.push({ name: 'dash' })
    } finally {
        logining.value = false
    }
}

import modal from '@/components/modal.vue'
</script>

<template>
    <modal>
        <template #title>
            <span>登录表单</span>
        </template>
        <template #content>
            <div v-loading="logining">
                <div id="login-form">
                    <label for="password-input">密码</label>
                    <input type="password" id="password-input" v-model="password" />
                </div>
                <button type="button" id="form-submit" @click="do_login">登录</button>
            </div>
        </template>
    </modal>
</template>

<style scoped>
#login-form {
    margin: 2px 0;
    column-gap: 5px;
    display: flex;
    align-items: center;
}

#password-input {
    flex: 1;
}

#form-submit {
    width: 100%;
    margin: 2px 0;
}
</style>
