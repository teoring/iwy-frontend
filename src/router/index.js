import { createWebHistory, createRouter } from "vue-router";
import store from '@/store/index';

import AppLayout from '@/layout/AppLayout.vue';

const routes =  [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: "/dashboard",
                name: 'dashboard',
                component: () => import('../components/MainPage.vue'),
                meta: {
                    requiresAuth: true
                },

                beforeEnter: ( to, from, next ) => {
                    console.log( "store.state.auth.isLoggedIn: " + store.state.auth.isLoggedIn );
                    next();
                }
            },
        ]
    },
    {
        path: "/login",
        name: 'login',
        component: () => import('../components/LoginView.vue'),

        beforeEnter: ( to, from, next ) => {
            console.log( "store.state.auth.isLoggedIn: " + store.state.auth.isLoggedIn );

            if( store.state.auth.isLoggedIn ) {
                next( { name: 'dashboard' } );
            } else {
                next();
            }
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: "/",
    }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    if( to.matched.some( record => record.meta.requiresAuth ) ) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if( ! store.state.auth.isLoggedIn ) {
        next( { name: 'login' } )
      } else {
        next() // go to wherever I'm going
      }
    } else {
      next() // does not require auth, make sure to always call next()!
    }
  })
