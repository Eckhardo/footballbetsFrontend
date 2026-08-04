import {defineStore} from "pinia";

export const useUmsInfoStore = defineStore('umsInfoStore', {
    // state is a function that returns the initial state object
    state: () => (
        {
            umsInfo: {
                username: null,
                userId:null,
                loggedIn: false,
                defaultCountry: null,
                defaultCommunityId: String,
                defaultCommMembId: String,
                defaultCompMembId: String,
                defaultCompetitionId: String,
                commAdmin: false,
                compAdmin: false,
                adminCompetitions: Array,
                adminCommunities: Array,
                tipperCommunities: Array,
                path: "info",
                invalidPath: false
            }
        }


    ),
    persist: true,
    getters: {

        // Getters can access the state and return computed values
        username: (state) => state.umsInfo.username,
        userId: (state) => state.umsInfo.userId,
        loggedIn: (state) => state.umsInfo.loggedIn,
        commAdmin: (state) => state.umsInfo.commAdmin,
        compAdmin: (state) => state.umsInfo.compAdmin,
        defaultCommunityId: (state) => state.umsInfo.defaultCommunityId,
        defaultCompetitionId: (state) => state.umsInfo.defaultCompetitionId,
        defaultCommMembId: (state) => state.umsInfo.defaultCommMembId,
        defaultCompMembId: (state) => state.umsInfo.defaultCompMembId,
        defaultCountry: (state) => state.umsInfo.defaultCountry,
        adminCommunities: (state) => state.umsInfo.adminCommunities,
        adminCompetitions: (state) => state.umsInfo.adminCompetitions,
        tipperCommunities: (state) => state.umsInfo.tipperCommunities,
        path: (state) => state.umsInfo.path,
        invalidPath: (state) => state.umsInfo.invalidPath,

    },
    actions: {
        // You can also update the entire object or nested properties
        async fillUmsInfoStore(data) {
            console.log("FillUmsInfoStore", JSON.stringify(data));
            // Simulate API or processing logic
            this.umsInfo = data
        },
        addTipperComm(id) {
            this.umsInfo.tipperCommunities().push(id)
        },
        setCompId(id) {
            console.log("SetCompId", id);
            this.umsInfo.defaultCompetitionId = id;
        },
        setCommId(id) {
            console.log("SetCommId", id);
            this.umsInfo.defaultCommunityId = id;
        },
        setCommMembId(id) {
            console.log("setCommMembId", id);
            this.umsInfo.defaultCommMembId = id;
        },
        setCompMembId(id) {
            console.log("setCompMembId", id);
            this.umsInfo.defaultCompMembId = id;
        },
        setDefaultCountry(country) {
            console.log("set country", country);
            this.umsInfo.defaultCountry = country;
        },
        setPath(path) {
            console.log("setPath", path);
            this.umsInfo.path = path;
        },
        setInvalidPath(bool) {
            console.log("setInvalidPath", bool);
            this.umsInfo.invalidPath = bool;
        },
    },
});

