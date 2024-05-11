import axios from "axios";
import config from "@/config";

import { SET_AUTHENTICATION, SET_JWT_TOKEN, SET_USER_INFO } from "../store/storeconstants";

import store from '@/store'
import { router } from '@/router'

export function useRoutines() {

    const logout = (confirm) => {

        console.log( confirm )
        
        confirm.require({
            message: 'Are you sure you want to log out?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            rejectClass: 'p-button-secondary p-button-outlined',
            rejectLabel: 'Cancel',
            acceptLabel: 'Yes',
            accept: () => {
                store.commit(`auth/${SET_AUTHENTICATION}`, false);
                store.commit(`auth/${SET_JWT_TOKEN}`, "");
                store.commit(`auth/${SET_USER_INFO}`, {});
                router.push( { name: "login" });
            },
            reject: () => {
                
            }
        });
    }

    return { logout };
}

