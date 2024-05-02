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
                                <div
                                    v-for="(item, index) in slotProps.items"
                                    :key="index"
                                    class="col-12 sm:col-6 lg:col-12 xl:col-4 p-3"
                                >
                                    <div class="p-3 py-2 border-1 surface-border surface-card border-round">
                                        <div class="flex flex-wrap align-items-center justify-content-between">
                                            <div class="flex align-items-center gap-2 p-1 py-3 pl-2">
                                                {{ item.title }}

                                                <span class="">{{ item.link }} | {{ item.selector }} | {{ item.currentPrice }}  | {{ item.newPrice }} </span>
                                                <Button size="small" @click=removeWatcher(item) class="p-2" icon="pi pi-times-circle"></Button>
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

import CreateWatcherDialog from '@/components/CreateWatcherDialog.vue';

import axios from "axios";

import { useDateFormat } from "@vueuse/core";
import { useToast } from "primevue/usetoast";
import { watch } from "vue";
import { useStore } from "vuex";

export default {
    name: "MainPage",
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
                                watcher.link.toLowerCase().search( input )     != -1 ||
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

                        dialog.open( CreateWatcherDialog, {
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
.p-tag-a-pp {
    background-color: #63aa5a;
}
.p-tag-a-p {
    background-color: #7bae4a;
}
.p-tag-a {
    background-color: #bdd342;
}
.p-tag-b {
    background-color: #ffe731;
}
.p-tag-c {
    background-color: #fbb900;
}
.p-tag-d {
    background-color: #fb8800;
}
.p-tag-e {
    background-color: #e30613;
}
</style>
