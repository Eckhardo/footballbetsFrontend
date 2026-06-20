<template>
  <div class="container mt-5">
    <ShowMessage v-bind:message="message" v-bind:showMessage="showMessage"/>


    <ShowError v-bind:show-alert="showAlert"
               v-bind:message="message"
               v-bind:error-message="errorMessage"
               v-bind:error-details="errorDetails"/>

    <!-- Matches Form for multipe create of matches -->
    <MatchesForm v-if="isVisible && multiCreate"
                 v-bind:rounds="rounds"
                 v-bind:selected-round="selectedRound"
                 v-bind:comp-teams="compTeams"
                 @save-matches="saveMatches"/>


    <MatchForm v-if="isVisible && !multiCreate"
               v-bind:current-match="editingMatch"
               v-bind:matchdays="matchdays"
               v-bind:comp-teams="compTeams"
               v-bind:selected-matchday="selectedMatchday"
               @save-match="saveMatch"/>

    <!-- Match List for Read/Delete/Edit -->
    <MatchList v-if="! isVisible  && selectedMatchday && compTeams.length>=1"
               v-bind:matches="matches"
               v-bind:matchdays="matchdays"
               v-bind:selectedMatchday="selectedMatchday"
               @select-matchday="retrieveMatchesForMatchday"
               @create-match="createMatch"
               @create-matches="createMatches"
               @edit-match="editMatch"
               @delete-match="deleteMatch"/>
  </div>
</template>

<script>

import MatchList from "./MatchList.vue";
import MatchForm from "./MatchForm.vue";
import MatchesForm from "./MatchesForm.vue";
import {saveMessage} from "@/util/errorMessages.js";
import ShowError from "@/components/admin/competition/ShowError.vue";
import ShowMessage from "@/components/admin/competition/ShowMessage.vue";


import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import CompRoundDataService from "@/service/competition/CompRoundDataService.js";
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";
import MatchDataService from "@/service/competition/MatchDataService.js";
import CompTeamDataService from "@/service/competition/CompTeamDataService.js";

export default {
  name: 'Matches',
  components: {
    MatchesForm,
    MatchList,
    MatchForm,
    ShowError,
    ShowMessage
  },

  computed: {
    ...mapState(useUmsInfoStore, { compId: 'defaultCompetitionId'}),
  },
  mounted() {
    this.selectedCompId = this.compId;
    this.retrieveData();
  },

// Best practice: Clear timer if component is destroyed
  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  },
  data() {
    return {
      rounds:[],
      selectedRound: {},
      matchdays: [],
      selectedMatchday: null,
      matchdayId: null,
      matches: [],
      compTeams: [],
      editingMatch: null,
      isVisible: false,
      multiCreate: false,
      errorMessage: '',
      message: null,
      errorDetails: null, // Stores the full ProblemDetails object
      showAlert: false,// For validation errors (often in 'properties' or 'errors')
      showMessage: false
    };
  },
  methods: {

    updateMatchday() {

      console.log("updateMatchday");
      for (const matchday of this.matchdays) {
        if (this.matchdayId === matchday.id) {
          this.selectedMatchday = matchday;
          this.matchdayId = matchday.id;

          console.log("updated Matchday: " + this.selectedMatchday.spieltagNumber);
        }
      }
    },


    async retrieveData() {

      try {
        const compTeamsResponse = await CompTeamDataService.findAllForComp(this.selectedCompId);
        this.compTeams = compTeamsResponse.data;
        if (this.compTeams.length === 0) {
          this.errorMessage = 'No Teams registered: Please create Teams before creating games.'
          this.triggerAlert();
          return;
        }
        const roundResponse = await CompRoundDataService.findByCompId(this.selectedCompId);
        this.rounds = roundResponse.data;

        if (this.rounds.length >= 0) {
          this.selectedRound = this.rounds[0];
          this.roundId = this.selectedRound.id;
        }
        const matchdaysResponse = await MatchdayDataService.getMatchdaysByCompId(this.selectedCompId);
        this.matchdays = matchdaysResponse.data;
        console.log("matchday.size:" + this.matchdays.length);
        if (this.matchdays.length >= 0) {
          this.selectedMatchday = this.matchdays[0];
          this.matchdayId = this.selectedMatchday.id;
        }
        const matchesResponse = await MatchDataService.getAllByMatchdayId(this.matchdayId);
        this.matches = matchesResponse.data;
      } catch (error) {
        console.log("ERROR  retrieveData{}", error);
      }

    },
    async retrieveMatches() {
      console.log("retrieveMatches::", this.matchdayId);
      try {

        const responseMatches = await MatchDataService.getAllByMatchdayId(this.matchdayId);
        this.matches = responseMatches.data;
      } catch (error) {
        console.log("ERROR  matches{}", error);
      }
    },
    async retrieveMatchesForMatchday(payload) {
      console.log("retrieveMatchdaysForRound::", JSON.stringify(payload));
      try {
        this.matchdayId = payload.matchdayId;
        const response = await MatchDataService.getAllByMatchdayId(this.matchdayId);
        this.matches = response.data;
        this.updateMatchday();
      } catch (error) {
        console.error("ERROR match retrieval {}", error);
      }
    },

    async saveMatches(payload) {
      console.info("saveMatches::", JSON.stringify(payload));
      this.isVisible = false;
      try {
        const response = await MatchDataService.createBatch(payload);
        if (response.status === 201) {
          this.message = "Einträge wurden gespeichert."
          this.triggerMessage();
          await this.retrieveMatches();
          await this.updateMatchday();
        }
        else if (response.status === 400) {
         console.log("response::", JSON.stringify(response));
        }
      } catch (error) {
        console.error("ERROR save matches");
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();
        }
      }
      this.multiCreate = false;
    },

    async saveMatch(match) {
      this.isVisible = false;
      console.log("save match", JSON.stringify(match));

      if (match.id) {
        try {
          const updated = await MatchDataService.update(match.id, match);
          if (updated.status === 200) {
            await this.retrieveMatches();
            await this.updateMatchday();
            this.message = "Änderungen wurden gespeichert."
            this.triggerMessage();
          }
        } catch
            (error) {
          console.error("ERROR update match {}", error);
        }
      } else {

        console.log("create new match", JSON.stringify(match));
        try {
          const created = await MatchDataService.create(match);
          if (created.status === 201) {
            await this.retrieveMatches();
            await this.updateMatchday();
            this.message = "Einträge wurden gespeichert."
            this.triggerMessage();
          }
        } catch (error) {
          console.error("ERROR create match {}", error);
          const data = saveMessage(error);
          this.errorMessage = data.errorMessage;
          this.errorDetails = data.errorDetails;
          this.message = data.message;
          if (this.errorMessage) {
            this.triggerAlert();
          }
        }
      }
      this.editingMatch = null; // Clear editing state
    },
    createMatch(payload) {
      console.log("creating match", JSON.stringify(payload));
      // Set the match to be edited in the form
      this.editingMatch = null;
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
    },
    createMatches(payload) {
      console.log("creating matches", JSON.stringify(payload));
      // Set the compFamily to be edited in the form
      this.selectedMatchday = payload.selectedMatchday;
      this.isVisible = payload.isVisible;
      this.multiCreate = true;
    },
    editMatch(payload) {
      console.log("editing match", JSON.stringify(payload));
      // Set the match to be edited in the form
      this.editingMatch = {...payload.match};// Create a copy to prevent direct mutation
      this.isVisible = true;
    },
    deleteMatch(match) {

      console.log("deleting match ", JSON.stringify(match));
      if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        // If the user confirms, proceed with the deletion logic
        this.confirmDelete(match);
      }
    },
    confirmDelete(match) {
      MatchDataService.delete(match.id)
          .then(response => {
            console.log(response.status);
            this.retrieveMatches();
          })
          .catch(e => {
            console.log(e);
          });
    },

    triggerMessage() {
      // Clear any existing timer to reset the duration if clicked again
      if (this.timer) clearTimeout(this.timer);

      this.showMessage = true;

      // Hide after 5000ms (5 seconds)
      this.timer = setTimeout(() => {
        this.showMessage = false;
      }, 5000);
    },
    triggerAlert() {
      // Clear any existing timer to reset the duration if clicked again
      if (this.timer) clearTimeout(this.timer);

      this.showAlert = true;

      // Hide after 5000ms (5 seconds)
      this.timer = setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  }

}
;
</script>
