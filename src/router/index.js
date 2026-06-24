import {createRouter, createWebHistory} from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import Home from '@/views/Home.vue';
import Login from "@/views/Login.vue";
import Competitions from "@/views/admin/competition/competitions/Competitions.vue";
import CompFamilies from "@/views/admin/competition/compFamilies/CompFamilies.vue";
import CompRounds from "@/views/admin/competition/compRounds/CompRounds.vue";
import Matchdays from "@/views/admin/competition/matchdays/Matchdays.vue";
import CompFamily from "@/views/admin/competition/compFamilies/CompFamily.vue";
import Teams from "@/views/admin/competition/teams/Teams.vue";
import CompTeams from "@/views/admin/competition/compTeams/CompTeams.vue";
import Matches from "@/views/admin/competition/matches/Matches.vue";
import DefaultCompForm from "@/views/admin/competition/defaultCompetition/DefaultCompForm.vue";
import CompTableList from "@/views/admin/competition/compTable/CompTableList.vue";

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
            },
            {
                path: '/defaultCompForm',
                name: 'DefaultCompForm',
                component: DefaultCompForm,
            },
            {
                path: 'compFamily',
                name: 'CompFamily',
                component: CompFamily,
            },
            {
                path: 'compFamilies',
                name: 'CompFamilies',
                component: CompFamilies,
            },
            {
                path: 'comps',
                name: 'Comps',
                component: Competitions,
            },
            {
                path: 'compTeams',
                name: 'CompTeams',
                component: CompTeams,
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
            {
                path: 'login/:openDialog',
                name: 'Login',
                component: Login,
                props: true
            },

        ],
    },

    {
        path: '/community',
        component: MainLayout,
        children: [
            {
                path: '', // Matches "/community"
                name: 'communities',
                component: () => import('@/views/admin/community/communities/Communities.vue')
            },
            {
                path: 'tipper', // Matches "/community"
                name: 'tipper',
                component: () => import('@/views/admin/community/tipper/Tippers.vue'),
            },
            {
                path: 'tests', // Matches "/community"
                name: 'tests',
                component: () => import('../views/admin/community/wizard/CreateNewCommunityWizard.vue')
            },
            {
                path: '/commMemb/:id', // :id ist ein dynamischer Parameter
                name: 'CommMemb',
                component: () => import('../views/admin/community/commMemb/CommMemb.vue')

            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
