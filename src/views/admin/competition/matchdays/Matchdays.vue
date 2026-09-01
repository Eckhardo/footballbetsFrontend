<template>
  <div class="container mt-5">
    <ShowMessage v-bind:message="message" v-bind:showMessage="showMessage"/>

    <!-- Global Error Message -->

    <ShowError v-bind:show-alert="showAlert"
               v-bind:message="message"
               v-bind:error-message="errorMessage"
               v-bind:error-details="errorDetails"/>


    <!-- Matchdays Form for multipe create of matchdays -->
    <MatchdaysForm v-if="isVisible && multiCreate"
                  v-bind:rounds="rounds"
                  v-bind:selectedRound="selectedRound"
                  @save-matchdays="saveMatchdays"/>

    <!-- Matchday Form for Create/Update -->
    <MatchdayForm v-if="isVisible && !multiCreate"
                  v-bind:currentMatchday="editingMatchday"
                  v-bind:rounds="rounds"
                  v-bind:selectedRound="selectedRound"
                  @save-matchday="saveMatchday"/>

    <!-- Matchday List for Read/Delete/Edit -->
    <MatchdayList v-if="! isVisible  && selectedRound!==null"
                  v-bind:matchdays="matchdays"
                  v-bind:rounds="rounds"
                  v-bind:selectedRound="selectedRound"
                  @select-round="retrieveMatchdaysForRound"
                  @create-matchday="createMatchday"
                  @create-matchdays="createMatchdays"
                  @edit-matchday="editMatchday"
                  @delete-matchday="deleteMatchday"/>
  </div>
</template>

<script>
import MatchdayList from "./MatchdayList.vue";
import MatchdayForm from "./MatchdayForm.vue";
import MatchdaysForm from "./MatchdaysForm.vue";
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {saveMessage} from "@/util/errorMessages.js";
import ShowError from "@/components/admin/competition/ShowError.vue";
import ShowMessage from "@/components/admin/competition/ShowMessage.vue";

import CompRoundDataService from "@/service/competition/CompRoundDataService.js";
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";

export default {
  name: 'Matchdays',
  components: {
    ShowMessage,
    ShowError,

    MatchdayList,
    MatchdayForm,
    MatchdaysForm
  },

  computed: {
    ...mapState(useUmsInfoStore, ['umsInfo'])
  },
  // Best practice: Clear timer if component is destroyed
  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  },
  mounted() {
    this.selectedCompId = this.umsInfo.defaultCompetitionId;
    console.log("compId::",this.selectedCompId);
    this.retrieveData();
  },
  data() {
    return {
      rounds: [],
      matchdays: [],
      editingMatchday: null,
      isVisible: false,
      multiCreate:false,
      selectedRound: null,
      selectedCompId: null,
      roundId: null,
      errorMessage: '',
      message: null,
      errorDetails: null, // Stores the full ProblemDetails object
      showAlert: false,// For validation errors (often in 'properties' or 'errors')
      showMessage:false
    };
  },
  methods: {
    async updateSelectedRound() {
      for (const round of this.rounds) {
        if (round.id === this.roundId) {
          this.selectedRound = round;
          console.log("updated selected round::", JSON.stringify(this.selectedRound));
          break;
        }
      }
    },

    async retrieveData() {
      console.log("retrieveRounds for selected comp");
      try {
        const roundResponse = await CompRoundDataService.findByCompId(this.selectedCompId);
        this.rounds = roundResponse.data;
        for(const round of this.rounds) {
          console.log(JSON.stringify(round));
        }

        if (this.rounds.length >= 0) {
          this.selectedRound = this.rounds[0];
          this.roundId = this.selectedRound.id;
        }
        console.log("retrieve Matchdays for selected round:",JSON.stringify(this.selectedRound.id));
        const responseMatchday = await MatchdayDataService.getMatchdaysByRoundId(this.roundId);
        this.matchdays = responseMatchday.data;
      } catch (error) {
        console.log("ERROR  matchdays{}", error);
      }
    },

    async retrieveMatchdays() {
      console.log("retrieveMatchdays::", this.roundId);
      try {
        const responseMatchday = await MatchdayDataService.getMatchdaysByRoundId(this.roundId);
        this.matchdays = responseMatchday.data;
        await this.updateSelectedRound();
      } catch (error) {
        console.log("ERROR  matchdays{}", error);
      }
    },

    async retrieveMatchdaysForRound(payload) {
      console.log("retrieveMatchdaysForRound::", JSON.stringify(payload));
      try {
        const roundResponse = await MatchdayDataService.getMatchdaysByRoundId(payload.roundId);
        this.roundId = payload.roundId;
        await this.updateSelectedRound();
        this.matchdays = roundResponse.data;
      } catch (error) {
        console.error("ERROR round {}", error);
      }
    },
    async saveMatchdays(payload) {
      console.info("saveMatchdays::", JSON.stringify(payload));
      this.isVisible = false;
        try {
          const response = await MatchdayDataService.createBatch(payload);
          if (response.status === 201) {
            this.message = "Einträge wurden gespeichert."
            this.triggerMessage();
            await this.retrieveMatchdays();
            await this.updateSelectedRound();
          }
        } catch (error) {
          console.error("ERROR save competition");
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

    async saveMatchday(matchday) {
      this.isVisible = false;

      if (matchday.id) {
        try {
          // Update compRound
          const response = await MatchdayDataService.update(matchday.id, matchday);
          if (response.status === 200) {
            this.message = "Änderungen wurden gespeichert."
            this.triggerMessage();
            await this.retrieveMatchdays();
          }
        } catch (error) {
          console.log("ERROR update {}", error);
        }
      } else {
        try {
          const response = await MatchdayDataService.create(matchday);
          if (response.status === 201) {
            await this.retrieveMatchdays();
            await this.updateSelectedRound();
            this.message = "Einträge wurden gespeichert.";
            this.triggerMessage();
          }
        } catch (error) {
          console.error("ERROR save competition");
          const data = saveMessage(error);
          this.errorMessage = data.errorMessage;
          this.errorDetails = data.errorDetails;
          this.message = data.message;
          if (this.errorMessage) {
            this.triggerAlert();
          }
        }
      }
      this.editingMatchday = null; // Clear editing state
    },
    createMatchdays(payload) {
      console.log("creating matchdays", JSON.stringify(payload));
      // Set the round to be edited in the form
      this.selectedRound = payload.selectedRound;
      this.isVisible = payload.isVisible;
      this.multiCreate=true;
    },
    createMatchday(payload) {
      console.log("creating matchday", JSON.stringify(payload));
      // Set the compFamily to be edited in the form
      this.editingMatchday = null;
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
      this.multiCreate=false
    },
    editMatchday(payload) {
      console.log("editing matchday", JSON.stringify(payload));
      // Set the matchday to be edited in the form
      this.editingMatchday = {...payload.matchday};// Create a copy to prevent direct mutation
      this.isVisible = true;
    },
    deleteMatchday(matchday) {

      console.log("deleting matchday ", JSON.stringify(matchday));
      if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        this.confirmDelete(matchday);
      }
    },
    confirmDelete(matchday) {
      MatchdayDataService.delete(matchday.id)
          .then(response => {
            console.log(response.status);
            this.retrieveMatchdays();
          })
          .catch(e => {
            console.log(e);
          });
    },

    triggerAlert() {
      // Clear any existing timer to reset the duration if clicked again
      if (this.timer) clearTimeout(this.timer);
      this.showAlert = true;
      // Hide after 3000ms (5 seconds)
      this.timer = setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    },
    triggerMessage() {
      // Clear any existing timer to reset the duration if clicked again
      if (this.timer) clearTimeout(this.timer);

      this.showMessage = true;

      // Hide after 3000ms (5 seconds)
      this.timer = setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    }
  }
};
</script>
