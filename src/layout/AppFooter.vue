<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `/NO.png`;
});
</script>

<template>
    <div class="layout-footer">
        <!-- <img :src="logoUrl" alt="Logo" height="20" class="mr-2" /> -->
        <span class="font-medium ml-2">Iwy </span>
        <span class="font-sm">&nbsp;2024</span>
    </div>
</template>
<style lang="scss" scoped></style>
