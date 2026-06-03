<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as OTPAuth from 'otpauth'

const props = defineProps({
    secret: { type: String, required: true }
})

const totpCode = ref('000000')
const remainingTime = ref(30)
let timer = null
let totp = null

const initTotp = () => {
    try {
        totp = new OTPAuth.TOTP({
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(props.secret.replace(/\s+/g, ''))
        })
        updateCode()
    } catch (e) {
        totpCode.value = 'ERROR'
    }
}

const updateCode = () => {
    if (!totp) return
    totpCode.value = totp.generate()
    remainingTime.value = 30 - (Math.floor(Date.now() / 1000) % 30)
}

const statusClass = computed(() => {
    if (remainingTime.value <= 5) return 'urgent'
    if (remainingTime.value <= 15) return 'warning'
    return 'normal'
})

watch(() => props.secret, initTotp)

onMounted(() => {
    initTotp()
    timer = setInterval(() => {
        if (remainingTime.value > 1) {
            remainingTime.value--
        } else {
            updateCode()
        }
    }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
    <span :class="['totp-span', statusClass]">{{ totpCode }}</span>
</template>

<style scoped>
.totp-span {
    transition: color 0.5s ease;
}

.normal {
    color: #007bff;
}

.warning {
    color: #ffc107;
}

.urgent {
    color: #dc3545;
}
</style>
