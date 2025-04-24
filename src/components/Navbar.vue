<script setup>
import { ref, inject, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const isUserMenuOpen = ref(false)
const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
};

const toggleSidebar = inject('toggleSidebar')

onMounted(() => {
    if (toggleSidebar) toggleSidebar()
})
</script>

<template>
    <div class="navbar shadow-sm sticky top-0 z-10" id="navbar">
       
        <div class="flex-1">
            <router-link to="/" class="flex items-center ml-3">
                <img src="/logo-onetwo.png" class="h-10 mr-3" />
                <span class="self-center text-white text-xl font-normal whitespace-nowrap">OneTwo Application Backend</span>
            </router-link>
        </div>
        <!-- <div class="flex-1">
            <a class="btn btn-ghost text-xl">12App</a>
        </div> -->
        <div class="flex-none">
            <ul class="menu text-white menu-horizontal px-1">
                <li><a>Link</a></li>
                <li>
                    <details>
                        <summary>Parent</summary>
                        <ul class="text-white bg-base-100 rounded-t-none p-2">
                            <li><a>Link 1</a></li>
                            <li><a>Link 2</a></li>
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