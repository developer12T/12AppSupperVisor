<template>
    <div>
        <div class="bg-white px-2 shadow-slate-300 shadow-md rounded-lg overflow-auto md:w-card sm:w-[355px] sm:h-[430px]"
            :style="sTable" :class="hTable">
            <table class="w-full text-md text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                        <th scope="col" :class="thClass" v-for="col in columns" :key="col.id">
                            {{ col.title }}
                        </th>
                    </tr>
                </thead>
                <tbody v-if="isLoading">
                    <tr v-for="n in 5" :key="n">
                        <td v-for="col in columns" :key="col.id" class="text-center py-2">
                            <Skeleton width="100%" height="1rem" />
                        </td>
                    </tr>
                </tbody>
                <tbody v-else-if="data.status === 204 || data.length === 0">
                    <tr>
                        <td :colspan="columns.length" class="text-center py-4 text-gray-500">
                            <span> ไม่มีข้อมูล </span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="(item, index) in data" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                        class="border-b cursor-pointer" @click="handleClick(item)">
                        <td v-for="col in columns" :key="col.id" :class="tdClass">
                            <template v-if="col.id === ''">
                                <slot name="button" :rowData="item" />
                            </template>
                            <template v-else>
                                <slot :name="col.id" :rowData="item" :item="item">
                                    {{ item[col.id] }}
                                </slot>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Skeleton from './Skeleton.vue'; // นำเข้า Skeleton component

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    data: {
        type: [Array, Object],
        required: true,
        validator: (value) => Array.isArray(value) || (typeof value === 'object' && value !== null),
    },
    thClass: String,
    tdClass: String,
    hTable: String,
    sTable: String,
    isLoading: Boolean,
});

const emit = defineEmits(['row-click']);
const handleClick = (item) => {
    emit('row-click', item);
};
</script>