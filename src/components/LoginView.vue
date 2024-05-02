<template>
    <div class="container">
        <div class="bg"></div>
        <div class="card flex justify-content-center">
            <div class="card-body">
                <h3 style="margin-top: 10px">Welcome to <strong>Iwy</strong></h3>
                <span class="text-600 font-medium">Sign in to continue</span>

                <Form @submit="onSubmit" class="flex flex-column gap-2">
                    <div class="in3">
                        <InputGroup :class="{ 'p-invalid': emailErrorMsg }">
                            <InputGroupAddon>
                                <i class="pi pi-envelope"></i>
                            </InputGroupAddon>

                            
                            <span class="p-float-label">
                                <InputText
                                    id="email"
                                    @keyup="checkEmailField"
                                    placeholder="Email"
                                    v-model="email"
                                    name="email"
                                    :class="{ 'p-invalid': emailErrorMsg }"
                                    aria-describedby="email-text-error"
                                />
                                <label for="email">Email</label>
                            </span>
                        </InputGroup>
                        <small id="email-text-error" v-if="emailError" class="p-error">{{ emailErrorMsg }}</small>
                    </div>

                    <div class="in3">
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-key"></i>
                            </InputGroupAddon>
                            <span class="p-float-label">
                                <Password
                                    placeholder="Password"
                                    @keyup="checkPasswordField"
                                    v-model="password"
                                    name="password"
                                    :feedback="false"
                                    toggleMask
                                    :class="{ 'p-invalid': passwordErrorMsg }"
                                    aria-describedby="password-text-error"
                                />
                                <label for="password">Password</label>
                            </span>
                        </InputGroup>
                        <small v-if="passwordError" id="password-text-error" class="p-error">{{
                            passwordErrorMsg
                        }}</small>
                    </div>

                    <InlineMessage v-show="isLoginError" severity="error">{{ LoginError }}</InlineMessage>

                    <div class="form-group in3">
                        <Button @keyup.enter="enterClicked()" value="Submit" label="Login" type="submit" class="login-button" />
                    </div>

                    <div>
                        <p>Don't have an account? <a href="#">Create new account</a></p>
                    </div>
                </Form>
                <Toast position="bottom-right" group="br" />
            </div>
        </div>
    </div>
</template>

<script>
import { SET_AUTHENTICATION, SET_JWT_TOKEN, SET_USER_INFO } from "../store/storeconstants";
import { Form, Field, ErrorMessage } from "vee-validate";

import axios from "axios";

import { useToast } from "primevue/usetoast";
import { watch } from "vue";
import { useStore } from "vuex";

import Config from "../config";

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
    name: "LoginView",

    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        return {
            email: "",
            password: "",
            output: "",
            emailError: "",
            emailErrorMsg: "",
            passwordErrorMsg: "",
            passwordError: "",
            isLoginError: false,
            LoginError: "",
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
        async onSubmit() {
            //make sure email OR password are not empty
            if (this.email != "" && this.password != "") {
                const instance = axios.create({
                    baseURL: Config.serverAddr,
                    timeout: 4000,
                });

                try {
                    instance
                        .post("api/v1/auth/login", null, {
                            params: {
                                email: this.email,
                                password: this.password,
                            },
                        })
                        .then((response) => {
                            if (response && response.data && response.data.token != "") {
                                this.$store.commit(`auth/${SET_JWT_TOKEN}`, response.data.token);
                                this.$store.commit(`auth/${SET_AUTHENTICATION}`, true);
                                this.$store.commit(`auth/${SET_USER_INFO}`, response.data.user);

                                this.$router.push({ name: "dashboard" });
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

                            this.$store.commit(`auth/${SET_AUTHENTICATION}`, false);
                            this.$store.commit(`auth/${SET_JWT_TOKEN}`, "");
                            this.$store.commit(`auth/${SET_USER_INFO}`, {});

                            console.log(error);
                        });
                } catch (error) {
                    console.log(error);
                }
            } else {
                if (this.email == "") {
                    this.emailError = true;
                    this.emailErrorMsg = "Email is required.";
                }

                if (this.password == "") {
                    this.passwordError = true;
                    this.passwordErrorMsg = "Password is required.";
                }

                this.$store.commit(`auth/${SET_AUTHENTICATION}`, false);
                this.output = "Email and password can not be empty";
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
