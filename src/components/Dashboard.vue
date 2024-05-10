<template>
    <DynamicDialog />

    <div class="container">
        <div class="main-container">
            <div class="main-area">
                <div class="card pt-3">
                    <DataView  :value="selected_watchers" :paginator="true" :alwaysShowPaginator="false" @page="onDataViewPageChanged()" :layout="layout"  :rows="12">
                        <template #empty>
                                <div v-if="searchInput != null" class="pt-3">
                                    Nothing was found
                                </div>
                                <div v-if="searchInput == null" class="flex flex-wrap pt-2">
                                    <div class="w-full xl:w-4 p-3">
                                        <Skeleton class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" class="mb-2"></Skeleton>
                                        <Skeleton width="5rem" class="mb-2"></Skeleton>
                                        <Skeleton height="2rem" class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" height="4rem"></Skeleton>
                                    </div>
                                    <div class="w-full xl:w-4 p-3">
                                        <Skeleton class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" class="mb-2"></Skeleton>
                                        <Skeleton width="5rem" class="mb-2"></Skeleton>
                                        <Skeleton height="2rem" class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" height="4rem"></Skeleton>
                                    </div>
                                    <div class="w-full xl:w-4 p-3">
                                        <Skeleton class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" class="mb-2"></Skeleton>
                                        <Skeleton width="5rem" class="mb-2"></Skeleton>
                                        <Skeleton height="2rem" class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" height="4rem"></Skeleton>
                                    </div>
                                </div>
                                <div v-if="searchInput == null" class="flex flex-wrap">
                                    <div class="w-full xl:w-4 p-3">
                                        <Skeleton class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" class="mb-2"></Skeleton>
                                        <Skeleton width="5rem" class="mb-2"></Skeleton>
                                        <Skeleton height="2rem" class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" height="4rem"></Skeleton>
                                    </div>
                                    <div class="w-full xl:w-4 p-3">
                                        <Skeleton class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" class="mb-2"></Skeleton>
                                        <Skeleton width="5rem" class="mb-2"></Skeleton>
                                        <Skeleton height="2rem" class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" height="4rem"></Skeleton>
                                    </div>
                                    <div class="w-full xl:w-4 p-3">
                                        <Skeleton class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" class="mb-2"></Skeleton>
                                        <Skeleton width="5rem" class="mb-2"></Skeleton>
                                        <Skeleton height="2rem" class="mb-2"></Skeleton>
                                        <Skeleton width="10rem" height="4rem"></Skeleton>
                                    </div>
                                </div>
                        </template>

                        <template #header>
                            <div>
                                <div class="flex  flex-wrap justify-content-end align-items-center gap-3">
                                    <Menubar :model="menuItems" />

                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText class="flex flex-wrap" v-model="searchInput" v-tooltip.top="'Enter address, city, postcode, price, date or source.'" placeholder="Search" />
                                    </span>
                                </div>
                            </div>
                        </template>

                        <template #grid="slotProps">
                            <div class="grid grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-6 md:col-4 p-2">
                                <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
                                    <div class="surface-50 flex justify-content-center border-round p-3">
                                        <div class="relative mx-auto">
                                            <Image :src='"http://localhost/screenshots/" + item._id + ".jpg"' v-if="extractedPrice != ''" alt="Image" width="250" preview />

                                            <!-- <img class="border-round w-full" :src='"http://localhost/screenshots/" + item._id + ".jpg"' :alt="item.title" style="max-width: 300px" /> -->
                                            <!-- <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute" style="left: 4px; top: 4px"></Tag> -->
                                        </div>
                                    </div>
                                    <div class="pt-4">

                                        <div class="flex flex-row justify-content-between align-items-start gap-2">
                                            <div>
                                                <span class="font-medium text-secondary text-sm">Product Name</span>
                                                <div class="text-lg font-medium text-900 mt-1">{{ item.title }}</div>
                                            </div>
                                            <div class="surface-100 p-1" style="border-radius: 30px">
                                                <div class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                                    <!-- <span class="text-900 font-medium text-sm">{{ item.rating }}</span> -->
                                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-column gap-4 mt-4">
                                            <span class="text-xl font-semibold text-900">Current price: {{ item.lastSeenPrice }}</span>
                                            <div class="flex gap-2">
                                                <Button icon="pi pi-directions" @click=redirectTo(item) label="View" class="flex-auto white-space-nowrap"></Button>
                                                <Button size="small" severity="danger" @click=removeWatcher(item) class="p-2" icon="pi pi-times-circle"></Button>
                                                <!-- <Button size="small" severity="info" class="p-2" icon="pi pi-directions"></Button> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            <!-- <div class="grid grid-nogutter">
                                <div
                                    v-for="(item, index) in slotProps.items"
                                    :key="index"
                                    class="col-12 sm:col-6 lg:col-12 xl:col-4 p-3"
                                >
                                    <div class="p-3 py-2 border-1 surface-border surface-card border-round" @click="onClick">
                                        <div class="flex flex-wrap align-items-center justify-content-between">
                                            <div class="flex align-items-center gap-2 p-1 py-3 pl-2">
                                                <Image :src='"http://localhost/screenshots/" + item._id + ".jpg"' v-if="extractedPrice != ''" alt="Image" width="250" preview />

                                                <a :href='"/watcher/view?_id=" + item._id' style="text-decoration: none;">
                                                    {{ item.title }}
                                                </a>

                                                <span class="">{{ item.link }} | {{ item.selector }} | {{ item.currentPrice }}  | {{ item.newPrice }} </span>
                                                <a :href="item.url" target="_blank" rel="noopener noreferrer">
                                                    <Button size="small" severity="info" class="p-2" icon="pi pi-directions"></Button>
                                                </a>
                                                <Button size="small" severity="danger" @click=removeWatcher(item) class="p-2" icon="pi pi-times-circle"></Button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->
                        </template>
                    </DataView>
                </div>
            </div>
        </div>
        <Toast position="bottom-right" group="br" />
    </div>
</template>

<script>
import { GET_USER_INFO, GET_JWT_TOKEN, SET_AUTHENTICATION, SET_JWT_TOKEN, SET_USER_INFO } from "../store/storeconstants";
import { ref } from "vue";

import config from "@/config";
import { useCommunication } from "@/client";

const { getClient } = useCommunication();

import DynamicDialog from 'primevue/dynamicdialog';
import { useDialog } from 'primevue/usedialog';

import CreateWatcher from '@/components/CreateWatcher.vue';

import axios from "axios";

import { useDateFormat } from "@vueuse/core";
import { useToast } from "primevue/usetoast";
import { watch } from "vue";
import { useStore } from "vuex";

export default {
    name: "Dashboard",
    setup() {
        const store = useStore();
        const toast = useToast();

        watch(
            () => store.getters.getErrorMessage,
            (message, prevMessage) => {
                if (message) {
                    toast.add({
                        severity: "error",
                        summary: "Error",
                        detail: message,
                        group: "br",
                        life: 6000,
                    });
                }
            }
        );

        watch(
            () => store.getters.getInfoMessage,
            (message, prevMessage) => {
                console.log("info message", message);
                if (message) {
                    toast.add({
                        severity: "info",
                        summary: "Update",
                        detail: message,
                        group: "br",
                        life: 6000,
                    });
                }
            }
        );
    },
    watch: { searchInput( input )
        {
            console.log( input );

            input = input.toLowerCase();

            let foundWatchers = this.selected_watchers;

            if( input != "" ) {
                foundWatchers = foundWatchers.filter( function( watcher ) {
                    let found = watcher.title.toLowerCase().search( input )  != -1 ||
                                watcher.url.toLowerCase().search( input )     != -1 ||
                                watcher.selector.toLowerCase().search( input ) != -1;
                    return found;
                });

                this.selected_watchers = foundWatchers;
            }

            this.selected_watchers = foundWatchers;
        }
    },
    beforeMount() {
        this.getWatchers();
    },
    data() {
        return {
            client: getClient( 2000 ),
            searchInput: null,
            watchers: [],
            selected_watchers: [],
            layout: ref("grid"),
            menuItems: ref([
                {
                    label: 'Add watcher',
                    icon: 'pi pi-plus',
                    command: () => {
                        const dialog = this.$dialog;

                        dialog.open( CreateWatcher, {
                            props: {
                                header: 'Add watcher',
                                style: {
                                    width: '50vw',
                                },
                                breakpoints:{
                                    '960px': '75vw',
                                    '640px': '90vw'
                                },
                                modal: true
                            },
                            onClose: (opt) => {
                                this.getWatchers();
                            }
                        } );
                    }
                },
            ])
        };
    },
    methods: {
        redirectTo( item )
        {
            this.$router.push( { name: "watcher_view", query: { _id: item._id }  });
        },
        onClick()
        {
            console.log("TTT")
        },
        getWatchers() {
            let this_ = this;

            this.client.get("api/v1/watcher/get", null,  {} )
                .then( (response) => {
                    console.log( response )
                    if( response && response.data && response.data.watchers ) {
                        this.searchInput = ""
                        this.watchers = response.data.watchers;
                        this.selected_watchers = response.data.watchers;
                    } else {
                        this.showToast( "error", "Unexpected error. Refresh the page and try again." );
                    }

            }).catch( (error) => {

                if( error.response.status == 401 ) {
                    console.log( error )
                    this_.logout();
                }
                console.log( "Unexpected error: " + JSON.stringify( error ) );
            });
        },
        removeWatcher( watcher ) {
            let this_ = this;

            console.log( watcher )
            this.client.post("api/v1/watcher/remove", {
                    watcher
            })
            .then( (response) => {
                console.log( "REMOVED" )
                
                this_.searchInput = ""
                this_.watchers = this_.watchers.filter( item => watcher._id != item._id )
                this_.selected_watchers = this_.watchers;

            }).catch( (error) => {
                console.log( "Unexpected error: " + JSON.stringify( error ) );
            });
        },
        onDataViewPageChanged() {
            window.scrollTo( 0, 0 );
        },  
        showToast( severity, message ){
            let topic = "";

            if( severity == "error") { topic = "setErrorMessage" }
            if( severity == "info") { topic = "setInfoMessage" }

            this.$store.commit( topic, message );

            setTimeout(() => {
                this.$store.commit( topic, "");
            }, 100);
        },
        logout() {
            this.$store.commit(`auth/${SET_AUTHENTICATION}`, false);
            this.$store.commit(`auth/${SET_JWT_TOKEN}`, "");
            this.$store.commit(`auth/${SET_USER_INFO}`, {});
            this.$router.push({ name: "login" });
        },
    },
};
</script>

<style>
.prop-chip {
    font-size: 0.9rem;
}
.prop-chip img {
    width: 1.5rem;
    height: 1.5rem;
}
.p-dataview-header {
    padding: 0.5rem 1rem;
}
</style>
