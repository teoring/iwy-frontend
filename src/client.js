import axios from "axios";
import config from "@/config";

import { useStore } from "vuex";

let lastId = 0;
let onRequestAbortedOrTimeoutRequest = []

export function useCommunication() {

    const getClient = (timeout) => {
        const store = useStore();

        console.log( store.state.auth.jwtToken )

        const client = axios.create({
            baseURL: config.serverAddr,
            timeout: timeout,
            headers: {
                authorization: "bearer " + store.state.auth.jwtToken,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        client.interceptors.response.use(
            response => response,
            error => {

              if( error.code === 'ECONNABORTED' && error.message.includes( 'timeout' ) ) {
                    for( var i = 0; i < onRequestAbortedOrTimeoutRequest.length; i++ ) {
                        onRequestAbortedOrTimeoutRequest[i].cb();
                    }
              }

              return Promise.reject(error);
            }
          );

        return client;
    }

    const registerCallback = ( eventType, identity, cb ) =>
    {
        if( eventType == "onServerDown" )
        {
            // Already existing subscriber
            if( onRequestAbortedOrTimeoutRequest.find( subscriber => {
                return subscriber.identity === identity
            }) != undefined )
            {
                return;
            }

            let subscriber = { cb: cb, identity: identity, id: ++lastId };

            onRequestAbortedOrTimeoutRequest.push( subscriber );
            return subscriber.id;
        }

    }

    const unregisterCallback = ( callbackId ) =>
    {
        onRequestAbortedOrTimeoutRequest = onRequestAbortedOrTimeoutRequest.filter( subscriber => subscriber.id != callbackId );
    }

    return { getClient, registerCallback, unregisterCallback };
}

