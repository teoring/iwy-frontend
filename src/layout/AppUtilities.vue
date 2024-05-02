<template>
    <Dialog header="Server unavailable" :draggable="false" :closable="false" v-model:visible="showDisconnectedDialog" :breakpoints="{ '960px': '75vw' }" :style="{ width: '35vw' }" :modal="true">
        <p class="line-height-3 m-0">
            It seems that server is currently unavailable. Retrying to connect...
        </p>
        <template #footer>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCommunication } from "@/client";
const { registerCallback, unregisterCallback, getClient } = useCommunication();

import config from "@/config";

const client = getClient( config.statusTimeout );

const connectionCheckTimer = ref( null );
const showDisconnectedDialog = ref( null );

let callbackId = 0;

const disconnectionHandler = () =>
{
    showDisconnectedDialog.value = true;

    console.log( "unregistering callback ")

    unregisterCallback( callbackId );
    callbackId = 0;

    console.log( "setInterval callback ")

    connectionCheckTimer.value = setInterval( () => {

        console.log( "setting status poll ")

        client.get( "api/v1/service/status", null, {} )
            .then( (response) => {

                showDisconnectedDialog.value = false;
                clearInterval( connectionCheckTimer.value );
                connectionCheckTimer.value = null;

                console.log( "registering callback ")

                callbackId = registerCallback( "onServerDown", "AppUtilities", disconnectionHandler );

            }).catch( (error) => {
                console.log( error)

            });
    }, 5000 );

};

onMounted(() => {

    callbackId = registerCallback( "onServerDown", "AppUtilities", disconnectionHandler );

    // connectionCheckTimer.value = setInterval( () => {

    //     client.get( "api/v1/service/status", null, {} )
    //         .then( (response) => {
    //             showDisconnectedDialog.value = false;
    //         }).catch( (error) => {
    //             showDisconnectedDialog.value = true;
    //         });
    // }, 10000 );
});

</script>

<style lang="scss" scoped></style>
