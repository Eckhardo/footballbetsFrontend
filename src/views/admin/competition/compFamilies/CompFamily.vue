<template>
  <div v-if="loggedIn" class="container mt-5">
    <CompFamilyItem v-if="compFamily" v-bind:compFamily="compFamily"/>
    <CompItem v-if="competition" v-bind:competition="competition"/>
    <CompRoundItem v-if="compRounds" v-bind:compRounds="compRounds" v-bind:compName="compName"/>
    <MatchdayItem v-if="matchdays"  v-bind:matchdays="matchdays" />
  </div>
  <div v-else class="container mt-5">
    Du bist nicht angemeldet....
  </div>
</template>

<script>

import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

import CompFamilyItem from "./CompFamilyItem.vue";
import CompItem from "../competitions/CompItem.vue";
import CompRoundItem from "../compRounds/CompRoundItem.vue";
import MatchdayItem from "../matchdays/MatchdayItem.vue";
import FamilyDataService from "@/service/competition/FamilyDataService.js";
import CompDataService from "@/service/competition/CompDataService.js";
import CompRoundDataService from "@/service/competition/CompRoundDataService.js";
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";


export default {
  name: 'CompFamily',
  components: {

    CompItem,
    CompFamilyItem,
    CompRoundItem,
    MatchdayItem
  },

  mounted() {
    console.log("CompFamily mounted::");
    this.retrieveCompData();


  },


  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compId: 'defaultCompetitionId'}),
  },
  data() {
    return {
      compFamily: null,
      competition: null,
      compName: "",
      compRounds: null,
      matchdays: null
    };
  },
  methods: {

    async retrieveCompData() {
      try {
        const response = await FamilyDataService.findFamilyByCompId(this.compId);
        this.compFamily = response.data;
      } catch (error) {
        console.log("ERROR family {}", error);
      }

      try {
        const responseComp = await CompDataService.get(this.compId)
        this.competition = responseComp.data;
        this.compName = this.competition.name;
      } catch (error) {
        console.log("ERROR comp {}",error);
      }

      try {
        const responseRound = await CompRoundDataService.findByCompId(this.compId);
        this.compRounds = responseRound.data;
      } catch (error) {
        console.log("ERROR round {}",error);
      }

      try {
        const responseMatchday = await MatchdayDataService.getMatchdaysByCompId(this.compId);
        this.matchdays = responseMatchday.data;
      } catch (error) {
        console.log("ERROR  matchdays{}", error);
      }
    }
  }
}


</script>
