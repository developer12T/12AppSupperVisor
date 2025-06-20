<template>
    <div class="p-6 max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold mb-6">โปรไฟล์ผู้ใช้</h1>

        <div class="card bg-base-100 shadow-md p-6">
            <div class="flex items-center space-x-4 mb-6">
                <div class="avatar">
                    <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img :src="user.avatar || defaultAvatar" alt="User Avatar" />
                    </div>
                </div>
                <div>
                    <h2 class="text-xl font-semibold">{{ user.name }}</h2>
                    <p class="text-gray-500">{{ user.email }}</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="label">ชื่อผู้ใช้</label>
                    <input v-model="user.name" class="input input-bordered w-full" disabled />
                </div>

                <div>
                    <label class="label">เขต</label>
                    <input v-model="user.email" class="input input-bordered w-full" disabled />
                </div>
                <div>
                    <label class="label">โซน</label>
                    <input v-model="user.zone" class="input input-bordered w-full" disabled />
                </div>

                <div>
                    <label class="label">ตำแหน่ง</label>
                    <input v-model="user.role" class="input input-bordered w-full" disabled />
                </div>

                <div>
                    <label class="label">รหัสพนักงาน</label>
                    <input v-model="user.employeeId" class="input input-bordered w-full" disabled />
                </div>
            </div>

            <div class="mt-6 text-right">
                <button class="btn btn-primary" @click="editMode = true">แก้ไขโปรไฟล์</button>
            </div>
        </div>

        <!-- Modal แก้ไข -->
        <div v-if="editMode" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 class="text-xl font-semibold mb-4">แก้ไขโปรไฟล์</h2>
                <form @submit.prevent="updateProfile">
                    <input v-model="editForm.name" class="input input-bordered w-full mb-2" placeholder="ชื่อผู้ใช้" />
                    <input v-model="editForm.email" class="input input-bordered w-full mb-2" placeholder="อีเมล" />
                    <input v-model="editForm.zone" class="input input-bordered w-full mb-2" placeholder="อีเมล" />
                    <input v-model="editForm.role" class="input input-bordered w-full mb-2" placeholder="ตำแหน่ง" />
                    <input v-model="editForm.employeeId" class="input input-bordered w-full mb-4"
                        placeholder="รหัสพนักงาน" />

                    <div class="flex justify-end space-x-2">
                        <button type="button" class="btn" @click="editMode = false">ยกเลิก</button>
                        <button type="submit" class="btn btn-primary">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const route = useRoute()

const username = computed(() => route.params.username)

const defaultAvatar = `https://ui-avatars.com/api/?name=${route.params.username}&background=random`


const fullName = localStorage.getItem('fullName')
const area = localStorage.getItem('area')
const zone = localStorage.getItem('zone')
const saleCode = localStorage.getItem('saleCode')
// const username = localStorage.getItem('zone')
// mock user data
const user = ref({
    name: `${fullName}`,
    email: `${area}`,
    zone: `${zone}`,
    role: 'master',
    employeeId: `${saleCode}`,
    avatar: '',
})

const editMode = ref(false)
const editForm = ref({ ...user.value })

const updateProfile = () => {
    user.value = { ...editForm.value }
    editMode.value = false
    alert('✅ โปรไฟล์ได้รับการอัปเดตเรียบร้อยแล้ว')
}
</script>
