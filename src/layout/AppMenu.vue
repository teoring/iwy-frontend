<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import AppMenuItem from './AppMenuItem.vue';

import { SET_AUTHENTICATION, SET_JWT_TOKEN, SET_USER_INFO } from "../store/storeconstants";

const store = useStore();
const router = useRouter();

function logout() {

    store.commit(`auth/${SET_AUTHENTICATION}`, false);
    store.commit(`auth/${SET_JWT_TOKEN}`, "");
    store.commit(`auth/${SET_USER_INFO}`, {});
    router.push({ name: "login" });
}

const model = ref([
{
        label: "Home",
        items: [
            {
                label: "Dashboard",
                icon: "pi pi-home",
                command: () => { router.push({ name: "dashboard" }); }
            },
        ],
    },
    {
            label: "Profile",
            items: [
                {
                    label: "Logout",
                    icon: "pi pi-sign-out",
                    command: logout
                },
            ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
