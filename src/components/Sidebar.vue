<script setup>
import { ref, inject, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router'

const router = useRouter();
const store = useAuthStore();

const SignOut = async () => {
    store.logout();
    console.log('ออกจากระบบสําเร็จ');
    router.push("/");
};

const userRole = localStorage.getItem('role')

const isSidebarOpen = inject('isSidebarOpen')
const toggleSidebar = inject('toggleSidebar')

const showText = ref(isSidebarOpen.value);
const menuItems = ref([
    { name: 'แดชบอร์ด', icon: 'mdi:chart-areaspline', link: '/dashboard', submenu: null, roles: ['sale', 'admin', 'master'], },
    { name: 'อนุมัติร้านค้า', icon: 'mdi:store-clock', link: '/suppervisor/approve', submenu: null, roles: ['sale', 'admin', 'master'] },
    // { name: 'อนุมัติร้านค้า', icon: 'mdi:store-clock', link: '/suppervisor/approve', submenu: null, roles: ['sale', 'admin', 'master'] },
    // { name: 'นำออเดอร์เข้า M3', icon: 'mdi:cart-arrow-down', link: '/insert', submenu: null, roles: ['admin', 'master'] },
    { name: 'จัดการสินค้า', icon: 'mdi:toggle-switch-off', link: '/admin/product', submenu: null, roles: ['admin', 'master'] },
    // { name: 'รายการคืน', icon: 'mdi:cart-off', link: '/cn', submenu: null, roles: ['admin', 'master'] },

    // {
    //     name: 'ร้านค้า',
    //     icon: 'mdi:store',
    //     link: '#',
    //     submenu: [
    //         { name: 'ร้านที่ 1', link: '/ร้านค้า/ร้านที่1' },
    //         { name: 'ร้านที่ 2', link: '/ร้านค้า/ร้านที่2' }
    //     ]
    // },
    // { name: 'สต็อก', icon: 'fa-solid:warehouse', link: '#', submenu: null },
    // { name: 'โปรโมชั่น', icon: 'mdi:tag', link: '/โปรโมชั่น', submenu: null },
    // { name: 'ผู้ใช้งาน', icon: 'mdi:account', link: '/ผู้ใช้งาน', submenu: null }
]);

const openSubmenus = ref(new Set())
const toggleSubmenu = (index) => {
    if (openSubmenus.value.has(index)) {
        openSubmenus.value.delete(index)
    } else {
        openSubmenus.value.add(index)
    }
}

const isSubmenuOpen = (index) => {
    return openSubmenus.value.has(index)
}

const route = useRoute();
const isActive = (link) => {
    return route.path === link
}

watch(isSidebarOpen, (newVal) => {
    if (newVal) {
        setTimeout(() => showText.value = true, 200)
    } else {
        showText.value = false
    }
})
</script>
<template>
    <aside
        :class="[isSidebarOpen ? 'w-64' : 'w-20', 'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-gray-100 p-4 font-kanit flex flex-col justify-between']">
        <div>
            <button @click="toggleSidebar"
                class="flex items-center p-2 mb-4 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                <Icon :icon="isSidebarOpen ? 'bi:chevron-left' : 'bi:chevron-right'" class="h-5 w-5" />
                <span v-if="showText" class="ml-2 transition-opacity duration-300">ย่อเมนู</span>
            </button>
            <nav class="flex-1 mt-4">
                <ul class="space-y-2">
                    <li v-for="(item, index) in menuItems.filter(i => i.roles.includes(userRole))" :key="index">
                        <div v-if="item.submenu">
                            <button @click="toggleSubmenu(index)" type="button"
                                :class="['flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100', isSubmenuOpen(index) ? 'bg-gray-200' : '', !isSidebarOpen ? 'justify-center' : '']">
                                <Icon :icon="item.icon"
                                    class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900">
                                </Icon>
                                <span v-if="showText"
                                    class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap transition-opacity duration-300">
                                    {{ item.name }}
                                </span>
                                <Icon v-if="showText" class="w-3 h-3 transition-opacity duration-300"
                                    icon="mdi:chevron-down">
                                </Icon>
                            </button>
                            <ul v-show="isSidebarOpen && isSubmenuOpen(index)"
                                class="py-2 space-y-2 transition-all duration-300">
                                <li v-for="(subItem, subIndex) in item.submenu" :key="subIndex">
                                    <router-link :to="subItem.link"
                                        class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100"
                                        :class="{ 'bg-gray-200': isActive(subItem.link) }">{{ subItem.name
                                        }}</router-link>
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            <router-link :to="item.link"
                                :class="['flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200', { 'justify-center': !isSidebarOpen, 'bg-gray-200': isActive(item.link) }]">
                                <Icon :icon="item.icon" class="h-6 w-6"></Icon>
                                <span v-if="showText" class="ml-3 transition-opacity duration-300">{{ item.name
                                    }}</span>
                            </router-link>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
        <router-link to="#"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200"
            :class="{ 'justify-center': !isSidebarOpen }">
            <Icon icon="mdi:logout" class="h-6 w-6"></Icon>
            <span v-if="showText" @click="SignOut" class="ml-3 transition-opacity duration-300">ออกจากระบบ</span>
        </router-link>
    </aside>
</template>

<style scoped>
.transition-width {
    transition-property: width
}
</style>