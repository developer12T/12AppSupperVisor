<script setup>
import { ref, inject, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../store/auth'
import { useRoute, useRouter } from 'vue-router'

const isUserMenuOpen = ref(false)
const userProfile = ref({})
const router = useRouter()
const store = useAuthStore()

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value

};

const toggleSidebar = inject('toggleSidebar')

const SignOut = async () => {
    store.logout()
    // console.log('ออกจากระบบสําเร็จ')
    router.push('/')
    window.location.reload();
}

onMounted(() => {
    const username = localStorage.getItem('username')
    const fullName = localStorage.getItem('fullName')
    userProfile.value.username = username
    userProfile.value.fullName = fullName
    console.log(username)
    if (toggleSidebar) toggleSidebar()
})
</script>

<template>
    <div class="navbar shadow-sm sticky top-0 z-10" id="navbar">

        <div class="flex-1">
            <router-link to="/" class="flex items-center ml-3">
                <img src="/logo-onetwo.png" class="h-10 mr-3" />
                <span class="self-center text-white text-xl font-normal whitespace-nowrap">OneTwo Application
                    Backend</span>
            </router-link>
        </div>
        <!-- <div class="flex-1">
            <a class="btn btn-ghost text-xl">12App</a>
        </div> -->
        <div class="flex-none">
            <ul class="menu text-white menu-horizontal px-1">
                <li>
                    <a :href="`/admin/user/${userProfile.username}`">{{ userProfile.fullName }}</a>
                </li>
                <li class="w-35">
                    <details>
                        <summary>ตั้งค่า</summary>
                        <ul class="p-2 w-35 text-black">
                            <li><a>
                                    <Icon icon="mdi:person-card-details" class="h-6 w-6" />โปรไฟล์
                                </a></li>
                            <li class="bg-red-500 hover:bg-red-600 text-white rounded">
                                <a @click="SignOut">
                                    <Icon icon="mdi:logout" class="h-6 w-6" />
                                    ออกจากระบบ
                                </a>
                            </li>
                        </ul>
                    </details>
                </li>
            </ul>
        </div>
    </div>
</template>


<style scoped>
#navbar {
    /* position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999; */
    background-color: #00569D;

}
</style>