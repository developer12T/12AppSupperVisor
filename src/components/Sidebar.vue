<script setup>
import { ref, inject, watch, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useCart } from '../store/modules/cart.js'
import { useWithdrawStore } from '../store/modules/withdraw.js'
import { useStoresStore } from '../store/modules/store.js'
import { useRefundStock } from '../store/modules/refund.js'


const cartStore = useCart()
const router = useRouter()
const store = useAuthStore()
const withdrawStore = useWithdrawStore()
const storeModel = useStoresStore()
const refundStore = useRefundStock()
const route = useRoute();




const SignOut = async () => {
    store.logout()
    console.log('ออกจากระบบสําเร็จ')
    router.push('/')
}

const userRole = localStorage.getItem('role')
const platformType = localStorage.getItem('platformType')
const isSidebarOpen = inject('isSidebarOpen')
const toggleSidebar = inject('toggleSidebar')

const showText = ref(isSidebarOpen.value)

const menuItems = computed(() => [
    {
        name: 'แดชบอร์ด',
        icon: 'mdi:monitor-dashboard',
        link: '/',
        submenu: null,
        roles: ['admin', 'supervisor', 'dc', 'area_manager', 'sale_manager'],
        channel: ['CASH', "PC", "ADMIN"],
    },
    // { name: 'รายการออเดอร์', icon: 'mdi:receipt-text', link: '/supervisor/order', submenu: null, roles: ['supervisor', 'admin',] },
    // { name: 'รายการแจกสินค้า', icon: 'mdi:gift', link: '/supervisor/give', submenu: null, roles: ['supervisor', 'admin',] },
    {
        name: 'ข้อมูลแบบตาราง',
        icon: 'mdi:table',
        link: '#',
        submenu: [
            { icon: 'mdi:receipt-text', name: 'รายการออเดอร์', link: '/supervisor/order', channel: ["CASH", 'PC', "ADMIN"] },
            { icon: 'mdi:gift', name: 'รายการตัดแจก', link: '/supervisor/give', channel: ["CASH", 'PC', "ADMIN"] },
            { icon: 'mdi:autorenew', name: 'รายการเปลี่ยนสินค้า', link: '/supervisor/refundtable', channel: ["CASH", , "ADMIN"] },
            { icon: 'mdi:box-clock-outline', name: 'รายการใบเบิก', link: '/supervisor/withdrawtable', channel: ["CASH", 'PC', "ADMIN"] },
            { icon: 'mdi:credit-card-refund', name: 'รายการโอนจากเครดิต', link: '/supervisor/credit', channel: ["CASH", "ADMIN"] },
            { icon: 'mdi:store-clock', name: 'รายการร้านค้า', link: '/supervisor/storenewtable', channel: ["CASH", 'PC', "ADMIN"] },

        ],
        roles: ['admin', 'area_manager', 'sale_manager', 'dc', 'supervisor',],
        channel: ['CASH', "PC", "ADMIN"]
    },
    { name: 'รายการออเดอร์', icon: 'mdi:receipt-text', link: '/sale/order', submenu: null, roles: ['sale'], channel: ['CASH', "PC"] },
    { name: 'รายการแจกสินค้า', icon: 'mdi:gift', link: '/sale/give', submenu: null, roles: ['sale'], channel: ['CASH', "PC"] },
    { name: 'รายการคืนสินค้า', icon: 'mdi:autorenew', link: '/sale/refundtable', submenu: null, roles: ['sale'], channel: ['CASH', "PC"] },
    { name: 'รายการใบเบิก', icon: 'mdi:box-clock-outline', link: '/sale/withdrawtable', submenu: null, roles: ['sale'], channel: ['CASH', "PC"] },
    { name: 'เป้าหมาย', icon: 'mdi:target-arrow', link: '/sale/target', submenu: null, roles: ['sale', 'sale_manager', 'area_manager'], channel: ['CASH', "PC"] },

    {
        name: 'รายงานต่างๆ',
        icon: 'mdi:chart-areaspline',
        link: '#',
        submenu: [
            // { icon: 'mdi:chart-areaspline', name: 'รายงานยอดขาย', link: '/supervisor/report', channel: ['CASH', "PC"] },
            { icon: 'mdi:routes', name: 'รายงานการเข้าเยี่ยม', link: '/supervisor/checkin', channel: ['CASH', "ADMIN"] },
            { icon: 'mdi:chart-bar', name: 'รายงานสินค้า', link: '/supervisor/product', channel: ['CASH', "PC", "ADMIN"] },
            // { icon: 'mdi:money-100', name: 'รายการส่งเงิน', link: '/supervisor/sendmoney', channel: ['CASH', "PC"] },
            { icon: 'mdi:box-clock-outline', name: 'จำนวนร้านค้าแต่ละรูท', link: '/supervisor/storeinroute', channel: ['CASH', "PC", "ADMIN"] },
        ],
        roles: ['admin', 'supervisor', 'area_manager', 'sale_manager', 'dc'],
        channel: ['CASH', "PC", "ADMIN"]
    },

    {
        name: 'รายการอนุมัติ',
        icon: 'mdi:approval',
        link: '#',
        roles: ['admin', 'area_manager', 'sale_manager'],
        channel: ['CASH', 'PC', "ADMIN"],
        submenu: [
            { icon: 'mdi:store-clock', name: 'อนุมัติร้านค้า', link: '/supervisor/approve', channel: ['CASH', "PC", "ADMIN"] },
            { icon: 'mdi:box-clock-outline', name: 'อนุมัติใบเบิก', link: '/supervisor/withdraw', channel: ['CASH', "PC", "ADMIN"] },
            { icon: 'mdi:autorenew', name: 'อนุมัติขอคืน', link: '/supervisor/refund', channel: ['CASH', "PC", "ADMIN"] },
            { icon: 'mdi:archive-edit', name: 'อนุมัติขอปรับสต๊อก', link: '/supervisor/adjuststock', channel: ['CASH', "PC", "ADMIN"] },
            { icon: 'mdi:shop-location', name: 'อนุมัติร้านค้า Location', link: '/supervisor/storeapprovelatlong', channel: ['CASH', "PC", "ADMIN"] },
        ],

    },
    {
        name: 'รายงานส่งเงิน',
        icon: 'noto:money-with-wings',
        link: '#',
        roles: ['admin'],
        channel: ['CASH', 'PC', "ADMIN"],
        submenu: [
            { icon: 'fluent:shifts-day-20-filled', name: 'ยอดส่งเงินรายวัน', link: '/admin/sendmoneyDaily', channel: ['CASH', "ADMIN"] },
            { icon: 'material-symbols:calendar-month', name: 'ยอดส่งเงินประจำเดือน', link: '/supervisor/approve', channel: ['CASH', "ADMIN"] },
            { icon: 'fluent:money-hand-16-filled', name: 'สรุปยอดเงิน', link: '/supervisor/withdraw', channel: ['CASH', "ADMIN"] },
        ],

    },
    { name: 'อนุมัติร้านค้า', icon: 'mdi:store-clock', link: '/supervisor/approve', submenu: null, roles: ['supervisor'], badge: storeModel.count, channel: ['CASH', 'PC', "ADMIN"] },
    { name: 'ส่งร้านค้า', icon: 'mdi:store-edit', link: '/supervisor/sentstore', submenu: null, roles: ['supervisor'], channel: ['PC', "ADMIN"] },
    { name: 'อนุมัติใบเบิก', icon: 'mdi:box-clock-outline', link: '/supervisor/withdraw', submenu: null, roles: ['supervisor', 'dc',], badge: withdrawStore.count, channel: ['CASH', 'PC', "ADMIN"] },
    { name: 'อนุมัติขอคืน', icon: 'mdi:autorenew', link: '/supervisor/refund', submenu: null, roles: ['supervisor', 'dc',], badge: refundStore.count, channel: ['CASH', "ADMIN"] },
    { name: 'อนุมัติขอปรับสต๊อก', icon: 'mdi:archive-edit', link: '/supervisor/adjuststock', submenu: null, roles: ['dc'], channel: ['CASH', "ADMIN"] },
    { name: 'อนุมัติร้านค้า Location', icon: 'mdi:shop-location', link: '/supervisor/storeapprovelatlong', submenu: null, roles: ['supervisor'], badge: storeModel.countLat, channel: ['CASH', "ADMIN"] },
    { name: 'จัดการตะกร้า Sale', icon: 'mdi:cart-variant', link: '/supervisor/cartall', submenu: null, roles: ['supervisor'], badge: cartStore.cart.length, channel: ['CASH', 'PC', "ADMIN"] },
    { name: 'คู่มือการใช้งาน', icon: 'mdi:book-information-variant', link: '/sale/manual', submenu: null, roles: ['admin', 'supervisor', 'area_manager', 'sale_manager', 'sale'], channel: ['CASH', 'PC', "ADMIN"] },
    { name: 'จัดการผู้ใช้งาน', icon: 'mdi:person-card-details', link: '/admin/manageuser', submenu: null, roles: ['admin', 'supervisor', 'area_manager', 'sale_manager'], channel: ['CASH', 'PC', "ADMIN"] },
    { name: 'ดูร้านค้าตามพื้นที่', icon: 'mdi:map-marker-radius', link: '/supervisor/storemap', submenu: null, roles: ['admin', 'area_manager', 'sale_manager'], channel: ['CASH', "ADMIN"] },
    { name: 'จัดการสินค้า', icon: 'mdi:toggle-switch-off', link: '/admin/product', submenu: null, roles: ['admin', 'area_manager', 'sale_manager'], channel: ['CASH', 'PC', "ADMIN"] },
    { name: 'จัดการโปรโมทชั่น', icon: 'mdi:tag-approve-outline', link: '/admin/promotion', submenu: null, roles: ['admin', 'area_manager', 'sale_manager'], channel: ['CASH', 'PC', "ADMIN"] },
    { name: 'แจกสินค้า', icon: 'mdi:gift', link: '/admin/giveawayall', submenu: null, roles: ['admin', 'area_manager', 'sale_manager'], channel: ['CASH', 'PC', "ADMIN"] },
    { name: 'สต๊อกสินค้า', icon: 'mdi:warehouse', link: '/supervisor/stock', submenu: null, roles: ['admin', 'supervisor', 'dc', 'area_manager', 'sale_manager'], channel: ['CASH', 'PC', "ADMIN"] },
])

const openSubmenus = ref(new Set())
const toggleSubmenu = (index) => {

    openSubmenus.value.has(index) ? openSubmenus.value.delete(index) : openSubmenus.value.add(index)
}
const isSubmenuOpen = (index) => openSubmenus.value.has(index)

const isActive = (link) => route.path === link

watch(isSidebarOpen, (newVal) => {
    showText.value = newVal
})

watch(() => route.fullPath, async () => {
    await refreshSidebarData();
});

const refreshSidebarData = async () => {
    // console.log(userRole)
    // console.log(menuItems)
    await cartStore.getCartAll('');
    await withdrawStore.getCountPending('');
    await storeModel.getPendingStore('', '');
    await refundStore.getPendingRefund('', '');
    await storeModel.getLatLongOrderPending('', '');
};


onMounted(refreshSidebarData);

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
                    <li v-for="(item, index) in (menuItems || []).filter(i =>
                        (i?.roles || []).includes(userRole) &&
                        (i?.channel || []).includes(platformType)
                    )" :key="index">

                        <div v-if="item.submenu">
                            <button @click="toggleSubmenu(index)" type="button"
                                :class="['flex items-center w-full p-2 text-base transition duration-75 rounded-lg group hover:bg-base-300', isSubmenuOpen(index) ? 'bg-base-300' : '', !isSidebarOpen ? 'justify-center' : '']">
                                <Icon :icon="item.icon" class="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                                <span v-if="showText" class="flex-1 ms-3 text-left whitespace-nowrap">{{
                                    item.name }}</span>
                                <Icon v-if="showText" class="w-3 h-3" icon="mdi:chevron-down" />
                            </button>
                            <ul v-show="isSidebarOpen && isSubmenuOpen(index)" class="py-2 space-y-2">
                                <li v-for="(subItem, subIndex) in item.submenu">
                                    <router-link :to="subItem.link"
                                        v-if="(subItem.channel ?? []).includes(platformType)" :key="subIndex"
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
                            <router-link :to="item.link"
                                class="flex items-center p-2 rounded-lg hover:bg-base-300 relative"
                                :class="{ 'justify-center': !isSidebarOpen, 'bg-base-300': isActive(item.link) }">
                                <!-- Icon Wrapper -->
                                <div class="relative">
                                    <Icon :icon="item.icon" class="h-6 w-6" />

                                    <!-- Badge for cart only -->
                                    <span v-if="item.badge > 0"
                                        class="absolute -top-2 -right-2 text-xs font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                                        {{ item.badge }}
                                    </span>
                                </div>

                                <!-- Show name only when sidebar is open -->
                                <span v-if="showText" class="ml-3">{{ item.name }}</span>
                            </router-link>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    </aside>
</template>

<style scoped>
.transition-width {
    transition-property: width;
}
</style>
