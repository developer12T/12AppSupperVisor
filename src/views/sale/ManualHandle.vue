<template>
    <div class="max-w-3xl mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">{{ header }}</h1>
        <div v-if="isAdmin">
            <form @submit.prevent="uploadFile" class="mb-6 flex items-center gap-4">

                <input style="cursor: pointer;" class="border rounded" type="file" @change="onFileChange"
                    accept=".ppt,.pptx" />
                <button type="submit" class="btn btn-primary" :disabled="!selectedFile || uploading">
                    {{ uploading ? 'Uploading...' : 'Upload & Show' }}
                </button>
            </form>
        </div>
        <div v-if="pptUrl" class="border rounded p-4 bg-white shadow">
            <h2 class="font-semibold mb-2">{{ header }}</h2>
            <!-- Microsoft Office Online Viewer -->
            <iframe :src="officeViewerUrl" width="100%" height="480" frameborder="0" allowfullscreen></iframe>
        </div>
        <div v-else class="text-gray-400">No file uploaded.</div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const userRole = ref(localStorage.getItem('role') || '')
const platformType = localStorage.getItem('platformType')
const isAdmin = computed(() => userRole.value === 'admin')

const selectedFile = ref(null)
const pptUrl = ref('')
const uploading = ref(false)
let header = ref('')

// Set your actual domain or IP here
// const FILE_URL = 'https://apps.onetwotrading.co.th/manual/Manual.pptx'
let FILE_URL = ref('')

function onFileChange(e) {
    selectedFile.value = e.target.files[0] || null
}

onMounted(() => {
    pptUrl.value = FILE_URL
    switch (platformType) {
        case 'CASH':
            header = '12Cash Manual'
            FILE_URL = 'https://apps.onetwotrading.co.th/manual/Manual.pptx'
            break;
        case 'PC':
            header = '12PC Manual'
            FILE_URL = 'https://apps.onetwotrading.co.th/manual/Manual.pptx'
            break;

        default:
            break;
    }
})


// Compose Office viewer URL for given pptUrl
const officeViewerUrl = computed(() =>
    pptUrl.value
        ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptUrl.value)}`
        : ''
)

async function uploadFile() {
    if (!selectedFile.value) return
    uploading.value = true
    try {
        const formData = new FormData()
        formData.append('powerPoint', selectedFile.value)
        // You should create an API endpoint for upload. Here, we use /api/upload as example
        const res = await axios.post('https://apps.onetwotrading.co.th/api/cash/admin/createPowerPoint', formData, {
            headers: { 'Content-Type': 'multipart/form-data', 'x-channel': 'cash' }
        })
        pptUrl.value = 'https://apps.onetwotrading.co.th/manual/Manual.pptx' // Server should return { url: 'https://...' }
        alert('Upload success')
        window.location.reload()
    } catch (err) {
        alert('Upload failed')
        console.error(err)
    } finally {
        uploading.value = false
    }
}
</script>

<style>
.btn {
    background: #6366f1;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    font-weight: bold;
    transition: background 0.2s;
}

.btn:disabled {
    background: #c7d2fe;
}
</style>
