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
                                <div class="flex flex-wrap justify-content-end align-items-center gap-3">
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
                                            <Image :src='config.nginxAdd + "/screenshots/" + item._id + ".jpg"' width="250" alt="Image" preview />

                                            <!-- <img class="border-round w-full" :src='"http://localhost/screenshots/" + item._id + ".jpg"' :alt="item.title" style="max-width: 300px" /> -->
                                            <!-- <Tag :value="item.inventoryStatus" :severity="getSeverity(item)" class="absolute" style="left: 4px; top: 4px"></Tag> -->
                                        </div>
                                    </div>
                                    <div class="pt-2">

                                        <div class="gap-1">
                                            <div>
                                                <!-- <span class="font-medium text-secondary text-sm">Product Name</span> -->
                                                <div class="text-xl font-semibold text-900">{{ item.title }}</div>
                                            </div>
                                        </div>
                                        <div class="flex flex-column mt-2">
                                            <span :class="{ discounted_price: item.discounted, text_900: ! item.discounted }" class="text-s font-medium">Current price: {{ item.lastSeenPrice }}</span>
                                            <span class="pt-2 font-medium text-secondary text-sm">Original price: {{ item.originalPrice }}</span>
                                            <span class="pt-2 font-medium text-secondary text-sm">Target price: €{{ item.targetPrice }}</span>
                                            <div class="flex gap-2 pt-3">
                                                <Button icon="pi pi-directions" @click=redirectTo(item) label="View" class="flex-auto white-space-nowrap"></Button>
                                                <Button size="small" severity="danger" @click=removeWatcher(item) class="p-2" icon="pi pi-times-circle"></Button>
                                                <!-- <Button size="small" severity="info" class="p-2" icon="pi pi-directions"></Button> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
import { useConfirm } from "primevue/useconfirm";

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
            config: config,
            client: getClient( 2000 ),
            searchInput: null,
            watchers: [],
            selected_watchers: [],
            layout: ref("grid"),
            confirm: ref( useConfirm() ),
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
        getWatchers() {
            let this_ = this;

            this.client.get("api/v1/watcher/get", null,  {} )
                .then( (response) => {
                    console.log( response )
                    if( response && response.data && response.data.watchers ) {
                        this_.processWatchers( response.data.watchers );
                    } else {
                        this_.showToast( "error", "Unexpected error. Refresh the page and try again." );
                    }

            }).catch( (error) => {
                console.log( error )

                if(  error.response && error.response.status == 401 ) {
                    this_.logout();
                }
    
                console.log( "Unexpected error: " + JSON.stringify( error ) );
            });
        },
        strToNum( price ) {
            let strippedPrice = price.replace(/[^\d.-]/g, '');
            return parseFloat( strippedPrice );
        },
        processWatchers( watchers ) {
            console.log( watchers )
            this.searchInput = "";

            watchers.forEach( watcher => {
                let currPrice = this.strToNum( watcher.lastSeenPrice );
                // let targetPrice = this.strToNum( watcher.targetPrice );
                let originalPrice = this.strToNum( watcher.originalPrice );
                
                // If current price below original price, mark it as green
                watcher.discounted = false;
                if( currPrice < originalPrice ) {
                    watcher.discounted = true;
                }
            });

            this.watchers = watchers;
            this.selected_watchers = watchers;
        },
        removeWatcher( watcher ) {
            let this_ = this;

            console.log( "removeWatcher called" )

            this.confirm.require({
                message: 'Are you sure you want to delete the watcher?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Cancel',
                acceptLabel: 'Yes',
                accept: () => {
                    console.log( watcher )
                    this.client.post("api/v1/watcher/remove", {
                            watcher
                    })
                    .then( (response) => {
                        this_.searchInput = ""
                        this_.watchers = this_.watchers.filter( item => watcher._id != item._id )
                        this_.selected_watchers = this_.watchers;
                    }).catch( (error) => {
                        console.log( "Unexpected error: " + JSON.stringify( error ) );
                    });
                },
                reject: () => {
                    
                }
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
    width: 0.5rem;
    height: 1.5rem;
}
.p-dataview-header {
    padding: 0.5rem 1rem;
}

.discounted_price {
    color: #32de84;
}

.text_900 {
    color: var(--surface-900) !important;
}
</style>
