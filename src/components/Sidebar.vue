<script setup>
import { ref, inject, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const store = useAuthStore()

const SignOut = async () => {
    store.logout()
    console.log('ออกจากระบบสําเร็จ')
    router.push('/')
}

const userRole = localStorage.getItem('role')

const isSidebarOpen = inject('isSidebarOpen')
const toggleSidebar = inject('toggleSidebar')

const showText = ref(isSidebarOpen.value)

const menuItems = ref([
    { name: 'แดชบอร์ด', icon: 'mdi:monitor-dashboard', link: '/', submenu: null, roles: ['sale', 'admin', 'master'] },
    {
        name: 'รายงานยอดขาย',
        icon: 'mdi:chart-areaspline',
        link: '#',
        submenu: [
            { icon: 'mdi:chart-areaspline', name: 'รายงานยอดขาย', link: '/supervisor/report' },
            { icon: 'mdi:shop-location', name: 'รายงานการเช็คอิน', link: '/supervisor/checkin' },
            { icon: 'mdi:chart-bar', name: 'รายงานสินค้า', link: '/supervisor/product' },
        ],
        roles: ['sale', 'master']
    },
    { name: 'อนุมัติร้านค้า', icon: 'mdi:store-clock', link: '/supervisor/approve', submenu: null, roles: ['sale', 'admin', 'master'] },
    { name: 'จัดการผู้ใช้งาน', icon: 'mdi:person-card-details', link: '/admin/manageuser', submenu: null, roles: ['sale', 'admin', 'master'] },
    { name: 'จัดการสินค้า', icon: 'mdi:toggle-switch-off', link: '/admin/product', submenu: null, roles: ['admin', 'master'] },
    { name: 'จัดการโปรโมทชั่น', icon: 'mdi:tag-approve-outline', link: '/admin/promotion', submenu: null, roles: ['admin', 'master'] },
    { name: 'รายการส่งเงิน', icon: 'mdi:money-100', link: '/supervisor/sendmoney', submenu: null, roles: ['admin', 'master'] },
    { name: 'แจกสินค้า', icon: 'mdi:gift', link: '/admin/giveaway', submenu: null, roles: ['admin', 'master'] },
    // { name: 'เช็คอิน', icon: 'mdi:shop-location', link: '/supervisor/checkin', submenu: null, roles: ['sale', 'master'] },

])

const openSubmenus = ref(new Set())
const toggleSubmenu = (index) => {
    openSubmenus.value.has(index) ? openSubmenus.value.delete(index) : openSubmenus.value.add(index)
}
const isSubmenuOpen = (index) => openSubmenus.value.has(index)

const route = useRoute()
const isActive = (link) => route.path === link

watch(isSidebarOpen, (newVal) => {
    showText.value = newVal
})
</script>

<template>
    <aside
        :class="[isSidebarOpen ? 'w-64' : 'w-20', 'fixed top-0 left-0 z-60 h-screen transition-all duration-300 bg-base-200 p-4 font-kanit flex flex-col justify-between']">
        <div>
            <button @click="toggleSidebar"
                class="flex items-center p-2 mb-4 text-gray-500 rounded-lg hover:bg-base-300">
                <Icon :icon="isSidebarOpen ? 'bi:chevron-left' : 'bi:chevron-right'" class="h-5 w-5" />
                <span v-if="showText" class="ml-2 transition-opacity duration-300">ย่อเมนู</span>
            </button>

            <nav class="flex-1 mt-4">
                <ul class="space-y-2">
                    <li v-for="(item, index) in menuItems.filter(i => i.roles.includes(userRole))" :key="index">
                        <div v-if="item.submenu">
                            <button @click="toggleSubmenu(index)" type="button"
                                :class="['flex items-center w-full p-2 text-base transition duration-75 rounded-lg group hover:bg-base-300', isSubmenuOpen(index) ? 'bg-base-300' : '', !isSidebarOpen ? 'justify-center' : '']">
                                <Icon :icon="item.icon" class="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                                <span v-if="showText" class="flex-1 ms-3 text-left whitespace-nowrap">{{ item.name
                                    }}</span>
                                <Icon v-if="showText" class="w-3 h-3" icon="mdi:chevron-down" />
                            </button>
                            <ul v-show="isSidebarOpen && isSubmenuOpen(index)" class="py-2 space-y-2">
                                <li v-for="(subItem, subIndex) in item.submenu" :key="subIndex">
                                    <router-link :to="subItem.link"
                                        class="flex items-center w-full p-2 text-sm rounded-lg pl-11 hover:bg-base-300"
                                        :class="{ 'bg-base-300': isActive(subItem.link) }">
                                        <Icon :icon="subItem.icon"
                                            class="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                                        <span v-if="showText" class="flex-1 ms-3 text-left whitespace-nowrap">{{
                                            subItem.name
                                        }}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            <router-link :to="item.link" class="flex items-center p-2 rounded-lg hover:bg-base-300"
                                :class="{ 'justify-center': !isSidebarOpen, 'bg-base-300': isActive(item.link) }">
                                <Icon :icon="item.icon" class="h-6 w-6" />
                                <span v-if="showText" class="ml-3">{{ item.name }}</span>
                            </router-link>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- <router-link to="#" class="flex items-center p-2 rounded-lg hover:bg-base-300"
            :class="{ 'justify-center': !isSidebarOpen }">
            <Icon icon="mdi:logout" class="h-6 w-6" />
            <span v-if="showText" @click="SignOut" class="ml-3 cursor-pointer">ออกจากระบบ</span>
        </router-link> -->
    </aside>
</template>

<style scoped>
.transition-width {
    transition-property: width;
}
</style>