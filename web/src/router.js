import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/dash',
            name: 'dash',
            component: () => import('@/view/dash.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/view/login.vue')
        }
    ]
})
