<template>
    <div class="p-6 max-full mx-auto">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">จัดการผู้ใช้</h1>
            <div class="flex justify-between items-center mb-4">
                <button class="btn btn-primary me-5" @click="openAddUserModal">+ เพิ่มผู้ใช้</button>
                <router-link to="/admin/checklist" class="flex items-center ml-3">
                    <button class="btn btn-success text-white" @click="">Report Check List</button>
                </router-link>
            </div>
        </div>

        <table class="table w-full table-zebra">
            <thead>
                <tr>
                    <th>No</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>userName</th>
                    <th>Ware House</th>
                    <th>อีเมล</th>
                    <th>สิทธิ์</th>
                    <th>การจัดการ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users" :key="user.salePayer">
                    <td>{{ index + 1 }}</td>
                    <td>{{ user.firstName }} {{ user.surName }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.warehouse }}</td>
                    <td>{{ user.area }}</td>
                    <td>{{ user.role }}</td>
                    <td class="space-x-2">
                        <button class="btn btn-sm btn-info" @click="editUser(user)">แก้ไข</button>
                        <button class="btn btn-sm btn-error" @click="deleteUser(user.id)">ลบ</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 class="text-xl font-semibold mb-4">{{ isEditMode ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้' }}</h2>
                <form @submit.prevent="saveUser">
                    <input v-model="form.name" class="input input-bordered w-full mb-2" placeholder="ชื่อผู้ใช้" />
                    <input v-model="form.email" type="email" class="input input-bordered w-full mb-2"
                        placeholder="อีเมล" />
                    <select v-model="form.role" class="select select-bordered w-full mb-4">
                        <option value="">เลือกสิทธิ์</option>
                        <option value="admin">ผู้ดูแล</option>
                        <option value="staff">พนักงาน</option>
                    </select>

                    <div class="flex justify-end space-x-2">
                        <button type="button" class="btn" @click="closeModal">ยกเลิก</button>
                        <button type="submit" class="btn btn-primary">{{ isEditMode ? 'บันทึก' : 'เพิ่ม' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUser } from '../../store/modules/user';


const userStore = useUser()
const users = ref([])

// const users = ref([
//     { id: 1, name: 'นที', email: 'natee@example.com', role: 'admin' },
//     { id: 2, name: 'ศิริพร', email: 'siri@example.com', role: 'staff' },
// ])

const showModal = ref(false)
const isEditMode = ref(false)
const editUserId = ref(null)

const form = ref({
    name: '',
    email: '',
    role: ''
})

const openAddUserModal = () => {
    isEditMode.value = false
    form.value = { name: '', email: '', role: '' }
    showModal.value = true
}

const editUser = (user) => {
    isEditMode.value = true
    editUserId.value = user.id
    form.value = { name: user.name, email: user.email, role: user.role }
    showModal.value = true
}

const saveUser = () => {
    if (isEditMode.value) {
        const index = users.value.findIndex(u => u.id === editUserId.value)
        if (index !== -1) {
            users.value[index] = { ...users.value[index], ...form.value }
        }
    } else {
        const newUser = { ...form.value, id: Date.now() }
        users.value.push(newUser)
    }
    closeModal()
}

const deleteUser = (id) => {
    users.value = users.value.filter(user => user.id !== id)
}

const closeModal = () => {
    showModal.value = false
}


onMounted(async () => {
    await userStore.getUser()
    users.value = userStore.user
})
</script>
