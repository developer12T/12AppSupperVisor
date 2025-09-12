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
    { name: 'แดชบอร์ด', icon: 'mdi:monitor-dashboard', link: '/', submenu: null, roles: ['admin', 'supervisor', 'dc', 'area_manager', 'sale_manager'] },

    // { name: 'รายการออเดอร์', icon: 'mdi:receipt-text', link: '/supervisor/order', submenu: null, roles: ['supervisor', 'admin',] },
    // { name: 'รายการแจกสินค้า', icon: 'mdi:gift', link: '/supervisor/give', submenu: null, roles: ['supervisor', 'admin',] },
    {
        name: 'รายการต่างๆ',
        icon: 'mdi:file-replace',
        link: '#',
        submenu: [
            { icon: 'mdi:receipt-text', name: 'รายการออเดอร์', link: '/supervisor/order' },
            { icon: 'mdi:gift', name: 'รายการตัดแจก', link: '/supervisor/give' },
            { icon: 'mdi:autorenew', name: 'รายการเปลี่ยนสินค้า', link: '/supervisor/refundtable' },
            { icon: 'mdi:box-clock-outline', name: 'รายการใบเบิก', link: '/supervisor/withdrawtable' },
            { icon: 'mdi:credit-card-refund', name: 'รายการโอนจากเครดิต', link: '/supervisor/credit' },
            { icon: 'mdi:store', name: 'รายการร้านค้าเปิดใหม่', link: '/supervisor/storenewtable' },

        ],
        roles: ['admin', 'area_manager', 'sale_manager', 'dc']
    },
    { name: 'รายการออเดอร์', icon: 'mdi:receipt-text', link: '/sale/order', submenu: null, roles: ['sale'] },
    { name: 'รายการแจกสินค้า', icon: 'mdi:gift', link: '/sale/give', submenu: null, roles: ['sale'] },
    { name: 'รายการคืนสินค้า', icon: 'mdi:autorenew', link: '/sale/refundtable', submenu: null, roles: ['sale'] },
    { name: 'รายการใบเบิก', icon: 'mdi:box-clock-outline', link: '/sale/withdrawtable', submenu: null, roles: ['sale'] },
    // { name: 'รายการใบเบิก', icon: 'mdi:box-clock-outline', link: '/sale/withdrawtable', submenu: null, roles: ['sale'] },
    { name: 'เป้าหมาย', icon: 'mdi:target-arrow', link: '/sale/target', submenu: null, roles: ['sale'] },

    {
        name: 'รายงานต่างๆ',
        icon: 'mdi:chart-areaspline',
        link: '#',
        submenu: [
            { icon: 'mdi:chart-areaspline', name: 'รายงานยอดขาย', link: '/supervisor/report' },
            { icon: 'mdi:routes', name: 'รายงานไลน์การเช็คอิน', link: '/supervisor/checkin' },
            // { icon: 'mdi:clipboard-check-outline', name: 'รายงานการเช็คอิน', link: '/supervisor/reportcheckin' },
            { icon: 'mdi:chart-bar', name: 'รายงานสินค้า', link: '/supervisor/product' },
            { icon: 'mdi:money-100', name: 'รายการส่งเงิน', link: '/supervisor/sendmoney' },
            { icon: 'mdi:box-clock-outline', name: 'จำนวนร้านค้าแต่ละรูท', link: '/supervisor/storeinroute' },

        ],
        roles: ['admin', 'supervisor', 'area_manager', 'sale_manager', 'dc']
    },
    {
        name: 'เช็ครายการใน M3',
        icon: 'mdi:error',
        link: '#',
        roles: ['admin', 'dc'],
        submenu: [
            { icon: 'mdi:warehouse', name: 'เช็ครายการเบิก', link: '/supervisor/withdrawm3' },
            { icon: 'mdi:cart', name: 'เช็ครายการออเดอร์', link: '/supervisor/orderm3' },

        ],
    },
    {
        name: 'รายการอนุมัติ',
        icon: 'mdi:approval',
        link: '#',
        roles: ['admin', 'area_manager', 'sale_manager'],
        submenu: [
            { icon: 'mdi:store-clock', name: 'อนุมัติร้านค้า', link: '/supervisor/approve' },
            { icon: 'mdi:box-clock-outline', name: 'อนุมัติใบเบิก', link: '/supervisor/withdraw' },
            { icon: 'mdi:autorenew', name: 'อนุมัติขอคืน', link: '/supervisor/refund' },
            { icon: 'mdi:archive-edit', name: 'อนุมัติขอปรับสต๊อก', link: '/supervisor/adjuststock' },
            // { icon: 'mdi:gift-open', name: 'อนุมัติแจกสินค้า', link: '/supervisor/gift' },

        ],
    },
    { name: 'อนุมัติร้านค้า', icon: 'mdi:store-clock', link: '/supervisor/approve', submenu: null, roles: ['supervisor'] },
    { name: 'อนุมัติใบเบิก', icon: 'mdi:box-clock-outline', link: '/supervisor/withdraw', submenu: null, roles: ['supervisor', 'dc',] },
    { name: 'อนุมัติขอคืน', icon: 'mdi:autorenew', link: '/supervisor/refund', submenu: null, roles: ['supervisor', 'dc',] },
    { name: 'อนุมัติขอปรับสต๊อก', icon: 'mdi:archive-edit', link: '/supervisor/adjuststock', submenu: null, roles: ['dc'] },
    { name: 'คู่มือการใช้งาน', icon: 'mdi:book-information-variant', link: '/sale/manual', submenu: null, roles: ['admin', 'supervisor', 'area_manager', 'sale_manager', 'sale'] },
    { name: 'จัดการผู้ใช้งาน', icon: 'mdi:person-card-details', link: '/admin/manageuser', submenu: null, roles: ['admin', 'supervisor', 'area_manager', 'sale_manager'] },
    // { name: 'ดูร้านค้าตามพื้นที่', icon: 'mdi:map-marker-radius', link: '/supervisor/storemap', submenu: null, roles: ['admin', 'area_manager', 'sale_manager'] },
    { name: 'จัดการสินค้า', icon: 'mdi:toggle-switch-off', link: '/admin/product', submenu: null, roles: ['admin', 'area_manager', 'sale_manager'] },
    { name: 'จัดการโปรโมทชั่น', icon: 'mdi:tag-approve-outline', link: '/admin/promotion', submenu: null, roles: ['admin', 'area_manager', 'sale_manager'] },
    { name: 'แจกสินค้า', icon: 'mdi:gift', link: '/admin/giveawayall', submenu: null, roles: ['admin', 'area_manager', 'sale_manager'] },
    { name: 'สต๊อกสินค้า', icon: 'mdi:warehouse', link: '/supervisor/stock', submenu: null, roles: ['admin', 'supervisor', 'dc', 'area_manager', 'sale_manager'] },
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