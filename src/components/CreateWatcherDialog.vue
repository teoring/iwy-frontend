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
                            <InputText placeholder="Name" v-model="title" />
                    </InputGroup>
                    <InputGroup class="pt-3">
                        <InputGroupAddon>
                            <i class="pi pi-link"></i>
                        </InputGroupAddon>
                            <InputText placeholder="Link" v-model="link" />
                    </InputGroup>
                    <InputGroup class="pt-3">
                        <InputGroupAddon>
                            <i class="pi pi-code"></i>
                            </InputGroupAddon>
                        <InputText placeholder="Selector" v-model="selector" />
                    </InputGroup>
                    <!-- <InputGroup class="pt-3">
                        <InputGroupAddon>
                            <i class="pi pi-euro"></i>
                        </InputGroupAddon>
                        <InputNumber v-model="currentPrice" />
                    </InputGroup> -->
                    <InputGroup class="pt-3">
                        <InputGroupAddon>
                            <i class="pi pi-euro"></i>
                        </InputGroupAddon>
                        <InputNumber v-model="newPrice" />
                    </InputGroup>
                </div>
                <div class="col-12 md:col-6">
                    <img src='https://primefaces.org/cdn/primevue/images/product/black-watch.jpg' class="w-24 border-round" />

                    <!-- <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
    animationDuration=".5s" aria-label="Custom ProgressSpinner" /> -->


                </div>
                </div>
                </div>
                <div class="justify-end">
                    <Button label="Verify" @click=onVerify />
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
            dialogRef: inject('dialogRef'),
            title: "",
            link: "",
            selector: "",
            currentPrice: 0,
            newPrice: 0,
            client: getClient( 3000 )
        };
    },
    methods: {
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
            let _this = this;

            try {
                this.client
                    .get("api/v1/watcher/verify", {
                        watcher: {
                            title: this.title,
                            link: this.link,
                            selector: this.selector,
                            currentPrice: this.currentPrice,
                            newPrice: this.newPrice
                        },
                    })
                    .then( (response) => {
                        console.log( response.data )
                        if (response && response.data && response.data != "" ) {

                            let snapshot =  response.data;
                            console.log( snapshot );

                            // this.dialogRef.close()

                            // this.$router.push({ name: "dashboard" });
                        } 
                    }) .catch( (error) => {
                        if( (error.code = "ECONNABORTED") ) {
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
        async onSubmit() {
                let _this = this;

                try {
                    this.client
                        .post("api/v1/watcher/add", {
                            watcher: {
                                title: this.title,
                                link: this.link,
                                selector: this.selector,
                                currentPrice: this.currentPrice,
                                newPrice: this.newPrice
                            },
                        })
                        .then((response) => {
                            if (response && response.data && response.data.token != "") {
                                this.dialogRef.close()

                                // this.$router.push({ name: "dashboard" });
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
.forgot-password {
    padding: 0px;
}
.login-button {
    width: 100%;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.in3 {
    padding-top: 20px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
}
.card-body {
    width: 490px;
    margin-top: 110px;
    margin-bottom: 70px;
    z-index: 9;
    background: #fff;
    align-items: center;
    box-shadow: 0 3px 20px 0 rgba(0, 0, 0, 0.1);
    padding: 2rem;
}
body {
    margin: 0;
    padding: 0;
}
.bg {
    position: absolute;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("/loginpage_header.jpg");
    width: 100%;
    height: 280px;
    margin: 0;
    padding: 0;
}
.h3,
h3 {
    font-size: 1.75rem;
}
.container {
    position: relative;
}
</style>
