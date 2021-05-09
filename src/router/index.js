import { createRouter, createWebHistory } from 'vue-router'
import UserLocation from '@/pages/UserLocation'

const routes = [{
    path: '/',
    name: 'Home',
    component: UserLocation
}]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router