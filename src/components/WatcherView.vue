<template>
    <DynamicDialog />

    <div class="container">
        <div class="main-container">
            <Menubar :model="menuItems">
                <template #end>
                    <div class="flex align-items-center gap-2">
                        <Button size="small" :disabled="! watcherChanged" @click=saveWatcher() class="p-2" label="Save changes"  icon="pi pi-save"></Button>
                    </div>
                </template>
            </Menubar>

            <div class="main-area pt-3">
                <div class="card pt-3">
                    <h5 class="pt-3">Watcher settingss</h5>
                    <div v-if="watcher == null" class="flex flex-wrap pt-2">
                        <div class="w-full ">
                            <Skeleton class="mb-2"></Skeleton>
                            <Skeleton width="10rem" class="mb-2"></Skeleton>
                            <Skeleton width="5rem" class="mb-2"></Skeleton>
                            <Skeleton height="2rem" class="mb-2"></Skeleton>
                            <Skeleton width="10rem" height="4rem"></Skeleton>
                        </div>
                    </div>

                    <div v-if="watcher == null" class="flex flex-wrap pt-2">
                        <div class="w-full ">
                            <Skeleton class="mb-2"></Skeleton>
                            <Skeleton width="10rem" class="mb-2"></Skeleton>
                            <Skeleton width="5rem" class="mb-2"></Skeleton>
                            <Skeleton height="2rem" class="mb-2"></Skeleton>
                            <Skeleton width="10rem" height="4rem"></Skeleton>
                        </div>
                    </div>

                    <div class="flex flex-wrap ">
                        
                        <div class="col-12 md:col-4">
                            <Image :src='"http://localhost/screenshots/" + watcher._id + ".jpg"' alt="Image" width="300" preview />

                        </div>
                        <div class="col-12 md:col-8">
                            <InputGroup>
                                <InputGroupAddon>
                                    <i class="pi pi-file"></i>
                                </InputGroupAddon>
                                    <InputText  placeholder="Name" @input=onWatcherChanged() v-model="watcher.title" />
                            </InputGroup>
                
                            <InputGroup class="pt-3">
                                <InputGroupAddon>
                                    <i class="pi pi-link"></i>
                                </InputGroupAddon>
                                    <InputText disabled placeholder="Link" v-model="watcher.url" />
                            </InputGroup>

                            <InputGroup class="pt-3">
                                <InputGroupAddon>
                                    <i class="pi pi-code"></i>
                                    </InputGroupAddon>
                                <InputText placeholder="Selector" @input=onWatcherChanged() v-model="watcher.selector" />
                            </InputGroup>

                            <InputGroup class="pt-3">
                                <InputGroupAddon>
                                    <i class="pi pi-euro"></i>
                                </InputGroupAddon>
                                <InputText @input=onWatcherChanged() v-model="watcher.targetPrice" />
                            </InputGroup>
                            
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h5>Item price history</h5>
                    <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem" />
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

import axios from "axios";

import { useToast } from "primevue/usetoast";
import { watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from 'vue-router'

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
    mounted() {
        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions();
    },
    beforeMount() {
        this.getWatcher();
        this.getSnapshots();

        // this.chartData = setChartData();
        // this.chartOptions = setChartOptions();
    },
    data() {
        return {
            watcherChanged: false,
            client: getClient( 2000 ),
            watcher: {},
            snapshots: {},
            chartData: {},
            chartOptions: {},
            menuItems: ref([
                {
                    label: 'All watchers',
                    icon: 'pi pi-list',
                    command: () => {
                        this.$router.push( { name: "dashboard" });
                    }
                },
            ])
        };
    },
    methods: {
        setChartData() 
        {
            const documentStyle = getComputedStyle(document.documentElement);

            return {
                labels: ['10/03', '11/03', '12/03', '13/03', '14/03', '15/03', '16/03'],
                datasets: [
                    {
                        label: 'Item Price',
                        data: [65, 59, 80, 81, 56, 55, 40, 40],
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--cyan-500'),
                        tension: 0.1
                    }
                ]
            };
        },
        setChartOptions()
        {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            return {
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };
        },
        saveWatcher()
        {
            let this_ = this;

            this.client
                    .post("api/v1/watcher/update", { watcher: this.watcher } )
                    .then( (response) => {
                        console.log( response.data )
                        if( response && response.data && response.data != "" && response.data.status != "fail" ) {
                            this_.watcherChanged = false;
                        } else {
                            this_.$store.commit("setErrorMessage", "Can't reach the server.");

                            setTimeout(() => {
                                this_.$store.commit("setErrorMessage", "");
                            }, 100);
                        }
                    }) .catch( (error) => {
                        if( (error.code = "ECONNABORTED") ) {
                            console.log(error);
                            this_.$store.commit("setErrorMessage", "Can't reach the server.");

                            setTimeout(() => {
                                this_.$store.commit("setErrorMessage", "");
                            }, 100);
                        }
                    });
        },
        onWatcherChanged()
        {
            this.watcherChanged = true;
        },
        getSnapshots()
        {
            const route = useRoute()

            if( route.query._id )
            {
                let this_ = this;

                // We request one specific watcher
                this.client.get("api/v1/snapshots/get", { params: { watcher_id: route.query._id } } )
                    .then( (response) => {
                        if( response && response.data && response.data.snapshots ) {
                            console.log( response.data.snapshots)
                            this.snapshots = response.data.snapshots;
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
            }
        },
        getWatcher()
        {
            const route = useRoute()

            if( route.query._id )
            {
                let this_ = this;

                // We request one specific watcher
                this.client.get("api/v1/watcher/get", { params: { watcher_id: route.query._id } } )
                    .then( (response) => {
                        if( response && response.data && response.data.watchers && response.data.watchers.length == 1 ) {
                            this_.watcher = response.data.watchers[0];
                            console.log( response.data.watchers[0] )
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
            }
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
h5 {
    font-size: 17.5px;
    font-family: "Inter var", sans-serif;
    color-scheme: light;
}
</style>