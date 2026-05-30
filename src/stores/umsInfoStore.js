import {defineStore} from "pinia";

export const useUmsInfoStore = defineStore('umsInfoStore', {
    // state is a function that returns the initial state object
    state: () => (
        {
            umsInfo: {
                username: null,
                loggedIn: false,
                defaultCountry: null,
                defaultCommunityId:String,
                defaultCompetitionId: String,
                commAdmin: false,
                compAdmin: false,
                adminCompetitions: Array,
                adminCommunities:Array,
                tipperCommunities:Array
       }
        }

    ),
    getters: {

        // Getters can access the state and return computed values
        username: (state) =>state.umsInfo.username,
        loggedIn: (state) =>state.umsInfo.loggedIn,
        commAdmin:(state)=> state.umsInfo.commAdmin,
        compAdmin:(state)=> state.umsInfo.compAdmin,
        defaultCommunityId:(state)=> state.umsInfo.defaultCommunityId,
        defaultCompetitionId:(state)=> state.umsInfo.defaultCompetitionId,
        defaultCountry:(state)=> state.umsInfo.defaultCountry
    },
    actions: {
        // You can also update the entire object or nested properties
        async fillUmsInfoStore(data) {
             console.log("FillUmsInfoStore", JSON.stringify(data));
            // Simulate API or processing logic
            this.umsInfo= data
            console.log("filled:", JSON.stringify(this.umsInfo));
        },
        addTipperComm(id) {
            this.umsInfo.tipperCommunities().push(id)
        },
        setCompId(id) {
            console.log("SetCompId", id);
            this.umsInfo.defaultCompetitionId=id;
        },
        setDefaultCountry(country) {
            console.log("set country", country);
            this.umsInfo.defaultCountry=country;
        },
    },
});

