<template>

</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue';
import { useProductsStore } from '../../store/modules/product';
import { useFilter } from '../../store/modules/filter'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";
</script>