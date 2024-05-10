<template>
    <div class="container">
        <div class="main-container">
                <div class="card">
                    <div class="grid p-fluid">

                    <div class="col-12 md:col-6">

                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-file"></i>
                        </InputGroupAddon>
                            <InputText placeholder="Name" v-model="watcher.title" />
                    </InputGroup>
                    <InputGroup class="pt-3">
                        <InputGroupAddon>
                            <i class="pi pi-link"></i>
                        </InputGroupAddon>
                            <InputText @input=inputChanged() :disabled="extractedPrice != ''" placeholder="Link" v-model="watcher.url" />
                    </InputGroup>
                    <InputGroup class="pt-3">
                        <InputGroupAddon>
                            <i class="pi pi-code"></i>
                            </InputGroupAddon>
                        <InputText @input=inputChanged() :disabled="extractedPrice != ''" placeholder="Selector" v-model="watcher.selector" />
                    </InputGroup>

                    <InputGroup class="pt-3" v-if="extractedPrice != ''" >
                        <InputGroupAddon>
                            <i class="pi pi-euro"></i>
                        </InputGroupAddon>

                        <InputText class="w-7" placeholder="Target price" disabled />

                        <InputNumber v-model="watcher.targetPrice" />
                    </InputGroup>
                    
                </div>
                <div class="col-12 md:col-6 text-center ">
                    <Image :src='"http://localhost/screenshots/" + snapshot._id + ".jpg"' v-if="extractedPrice != ''" alt="Image" width="300" preview />

                    <ProgressSpinner style="width: 50px; height: 50px"  strokeWidth="8" fill="var(--surface-ground)"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" v-if="verificationInProgress"  />

                    <InputGroup v-if="extractedPrice != ''" class="pt-3" >
                        <InputGroupAddon>
                            <i class="pi pi-euro"></i>
                        </InputGroupAddon>
                        <InputText placeholder="Current price"  disabled />
                        <InputText v-model="extractedPrice" disabled />
                    </InputGroup>
                </div>
                </div>
                </div>
                <div class="justify-end">
                    <Button label="Verify" @click=onVerify v-if="extractedPrice == ''"/>
                    <Button label="Submit" severity="success"  @click=onSubmit v-if="extractedPrice != ''" />

                    <Button class="ml-2" label="Cancel" @click=onCancel />
                </div>

        </div>
        <Toast position="bottom-right" group="br" />
    </div>
</template>

<script>
import { SET_AUTHENTICATION, SET_JWT_TOKEN, SET_USER_INFO } from "../store/storeconstants";
import { Form, Field, ErrorMessage } from "vee-validate";

import config from "@/config";
import { useCommunication } from "@/client";
const { getClient } = useCommunication();

import axios from "axios";

import { useToast } from "primevue/usetoast";
import { watch } from "vue";
import { useStore } from "vuex";

import Config from "../config";

import { inject } from "vue";

export default {
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
    name: "AddWatcherDialog",

    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        return {
            extractedPrice: 0,
            verificationInProgress: false,
            dialogRef: inject('dialogRef'),
            snapshot: {},
            watcher: { url: "https://www.amazon.nl/-/en/Redken-High-Rise-Shampoo-300/dp/B08Y155F2X?th=1",
                      selector: "#corePrice_feature_div > div > div > span.a-price.aok-align-center > span.a-offscreen",
                      title: "Redken Shampoo",
                      targetPrice: 0,
                      notifyAnyDiscount: false
            },
            client: getClient( 25000 )
        };
    },
    methods: {
        inputChanged() {
            this.extractedPrice = 0;
        },
        checkEmailField() {
            if (this.email != "") {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
                    this.emailError = false;
                    this.emailErrorMsg = "";
                } else {
                    this.emailError = true;
                    this.emailErrorMsg = "Please enter a valid email address.";
                }
            } else {
                this.emailError = true;
                this.emailErrorMsg = "Email is required.";
            }
        },
        checkPasswordField() {
            if (this.password != "") {
                this.passwordError = false;
                this.passwordErrorMsg = "";
            } else {
                this.passwordError = true;
                this.passwordErrorMsg = "Password is required.";
            }
        },
        onCancel() {
            this.dialogRef.close()
        },
        async onVerify() {
            let this_ = this;

            try {
                this.verificationInProgress = true;

                this.client
                    .post("api/v1/watcher/verify", {
                        watcher: this.watcher
                    } ).then( (response) => {
                        console.log("Response to verify:");

                        console.log( response.data.snapshot )
                        if ( response &&
                             response.data &&
                             response.data.snapshot &&
                             response.data.snapshot.status == "success")
                        {
                            this_.snapshot =  response.data.snapshot;
                            this_.extractedPrice = this_.snapshot.price;

                            this_.watcher._id = this_.snapshot._id;
                            this_.watcher.lastCheckTs = this_.snapshot.ts;
                            this_.watcher.lastSeenPrice = this_.snapshot.price;
                        } else {
                            console.log( "Not success on verify" );
                            this.$store.commit("setErrorMessage", "Can't reach the server.");

                            setTimeout(() => {
                                this.$store.commit("setErrorMessage", "");
                            }, 100);
                        }

                        this.verificationInProgress = false;

                    }).catch( (error) => {
                        if( (error.code = "ECONNABORTED") ) {
                            console.log(error);
                            this.$store.commit("setErrorMessage", "Can't reach the server.");

                            setTimeout(() => {
                                this.$store.commit("setErrorMessage", "");
                            }, 100);
                        }

                        this.verificationInProgress = false;
                    });
            } catch (error) {
                console.log(error);
            }
        },
        async onSubmit() {
            let this_ = this;

            console.log( this.watcher )

            try {
                this.client
                    .post("api/v1/watcher/add", {
                        watcher: this.watcher
                    })
                    .then( (response) => {
                        console.log( "Printing response to Submit" )

                        console.log( response.data )

                        if( response && response.data  ) {
                            this.dialogRef.close()
                        } else {

                            this.$store.commit(
                                "setErrorMessage",
                                "Unexpected error. Refresh the page and try again."
                            );

                            console.log(response);
                        }
                    })
                    .catch( (error) => {
                        if (error.code == "ERR_BAD_REQUEST") {
                            this.LoginError =
                                "The email address and password do not match our data. Please try again or reset your password.";
                            this.isLoginError = true;
                        } else if( (error.code = "ECONNABORTED") ) {
                            console.log(error);
                            this.$store.commit("setErrorMessage", "Can't reach the server.");

                            setTimeout(() => {
                                this.$store.commit("setErrorMessage", "");
                            }, 100);
                        }

                    });
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>

<style>

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.h3, h3 {
    font-size: 1.75rem;
}
.container {
    position: relative;
}

</style>
