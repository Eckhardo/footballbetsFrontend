import {createRouter, createWebHistory} from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

import Login from "@/views/Login.vue";
import CompRounds from "@/views/admin/competition/compRounds/CompRounds.vue";
import Matchdays from "@/views/admin/competition/matchdays/Matchdays.vue";

import Teams from "@/views/admin/competition/teams/Teams.vue";
import Matches from "@/views/admin/competition/matches/Matches.vue";

import CompTableList from "@/views/admin/competition/compTable/CompTableList.vue";

const routes = [

    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/Home.vue')
            },
            {
                path: '/:commName',
                name: 'SelectedCommMemb',
                component: () => import('../views/admin/tipper/overview/SelectedCommMemb.vue'),
                props: true,
            },
            {
                path: '/:commName/tippspielplan',
                name: 'Tippspielplan',
                component: () => import('../views/admin/tipper/spielplan/Spielplan.vue')
            },
            {
                path: '/:commName/tippModi',
                name: 'TippModi',
                component: () => import('@/views/admin/tipper/tippModi/TippModi.vue')
            },
            {
                path: '/:commName/tippConfigs',
                name: 'TippConfigs',
                component: () => import('@/views/admin/tipper/tippconfig/TippConfigs.vue')
            },
            {
                path: '/:commName/tippangabe',
                name: 'Tippabgabe',
                component: () => import('@/views/admin/tipper/tippabgabe/Tippabgabe.vue')
            },
            {
                path: '/:commName/tippOverview',
                name: 'TippOverview',
                component: () => import('@/views/admin/tipper/tippOverview/TippOverview.vue')
            },
            {
                path: '/:commName/login/:openDialog',
                name: 'Login',
                component: ()    => import('@/views/Login.vue'),
                props: true
            },
            {
                path: 'logout',
                name: 'Logout',
                component: ()    => import('@/views/Logout.vue')
            },
            {
                path: 'communities',
                name: 'communities',
                component: () => import('@/views/admin/community/communities/Communities.vue')
            },
            {
                path: 'tipper',
                name: 'tipper',
                component: () => import('@/views/admin/community/tipper/Tippers.vue'),
            },
            {
                path: 'createCommunity',
                name: 'CreateCommunity',
                component: () => import('@/views/admin/tipper/createCommunity/CreateNewCommunityWizard.vue')
            },

            {
                path: 'selectCommunity',
                name: 'CommunityByURL',
                component: () => import('@/views/CommunityByURL.vue')

            },

        ]
    },
    {
        path: '/comp',
        component: MainLayout,
        children: [
            {
                path: 'defaultCompForm',
                name: 'DefaultCompForm',
             component: ()    => import('@/views/admin/competition/defaultCompetition/DefaultCompForm.vue')
            },
            {
                path: 'compFamily',
                name: 'CompFamily',
                component: ()    => import('@/views/admin/competition/compFamilies/CompFamily.vue')
            },
            {
                path: 'compFamilies',
                name: 'CompFamilies',
                component: ()    => import('@/views/admin/competition/compFamilies/CompFamilies.vue')

            },
            {
                path: 'comps',
                name: 'Comps',
                component: ()    => import('@/views/admin/competition/competitions/Competitions.vue')

            },
            {
                path: 'compTeams',
                name: 'CompTeams',
                component: ()    => import('@/views/admin/competition/compTeams/CompTeams.vue')

            },
            {
                path: 'compTableList',
                name: 'CompTableList',
                component: CompTableList,
            },

            {
                path: 'compRounds',
                name: 'CompRounds',
                component: CompRounds,
            },

            {
                path: 'matchdays',
                name: 'Matchdays',
                component: Matchdays,
            },
            {
                path: 'matches',
                name: 'Matches',
                component: Matches,
            },

            {
                path: 'teams',
                name: 'Teams',
                component: Teams,
            },


        ],
    },

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
