<template>
  <div class="container mt-5">
    <ShowMessage v-bind:message="message" v-bind:showMessage="showMessage"/>
    <ShowError v-bind:show-alert="showAlert"
               v-bind:message="message"
               v-bind:error-message="errorMessage"
               v-bind:error-details="errorDetails"/>

    <!-- CompRound Form for Create/Update -->
    <CompRoundForm v-if="isVisible"
                   v-bind:current-comp-round="editingCompRound"
                   v-bind:competitions="competitions"
                   v-bind:selected-comp="selectedComp"
                   @save-compRound="saveCompRound"/>

    <!-- CompRound List for Read/Delete/Edit -->
    <CompRoundList v-if="! isVisible && selectedComp!==null"
                   v-bind:comp-rounds="compRounds"
                   v-bind:comps="competitions"
                   v-bind:selected-comp="selectedComp"
                   @select-competition="retrieveRoundsForCompetition"
                   @create-compRound="createCompRound"
                   @edit-compRound="editCompRound"
                   @delete-compRound="deleteCompRound"/>
  </div>
</template>

<script>
import CompRoundForm from "./CompRoundForm.vue";
import CompRoundList from "./CompRoundList.vue";
import CompRoundDataService from "@/service/competition/CompRoundDataService.js";
import CompDataService from "@/service/competition/CompDataService.js";
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {saveMessage} from "@/util/errorMessages.js";
import ShowError from "@/components/admin/competition/ShowError.vue";
import ShowMessage from "@/components/admin/competition/ShowMessage.vue";


export default {
  name: 'CompRounds',
  components: {
    ShowMessage,
    ShowError,

    CompRoundList,
    CompRoundForm
  },

  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compId: 'defaultCompetitionId'}),
  },
  mounted() {
    console.log("mounted: set compId from pinia to local writable id");
    this.selectedCompId = this.compId;
    this.retrieveData();
    this.retrieveRounds();
  },
  // Best practice: Clear timer if component is destroyed
  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  },
  data() {
    return {
      compRounds: [],
      editingCompRound: null,
      isVisible: false,
      competitions: [],
      selectedComp: null,
      selectedCompId: null,
      errorMessage: null,
      message: null,
      errorDetails: null, // Stores the full ProblemDetails object
      showAlert: false,// For validation errors (often in 'properties' or 'errors')
      showMessage:false

    };
  },
  methods: {

    async updateSelectedCompetition() {
      for (const comp of this.competitions) {
        if (comp.id === this.selectedCompId) {
          this.selectedComp = comp;
          console.log("updated selected comp::", JSON.stringify(this.selectedComp));
          break;
        }
      }
    },

    async retrieveData() {
      try {
        const response = await CompDataService.getAll();
        this.competitions = response.data;
        await this.updateSelectedCompetition()

      } catch (error) {
        console.error("ERROR comp{}", error);
      }
    },

    async retrieveRounds() {
      console.log("retrieveRounds: size of comps:", this.competitions.length);

      try {
        const roundResponse = await CompRoundDataService.findByCompId(this.selectedCompId);
        this.compRounds = roundResponse.data;

        for(const round of this.compRounds) {
          console.log(JSON.stringify(round));
        }
      } catch (error) {
        console.error("ERROR round {}", error);
      }

    },
    async retrieveRoundsForCompetition(payload) {

      this.selectedCompId = payload.compId;
      console.log("retrieveRoundsForCompetition", JSON.stringify(this.selectedCompId));
      try {
        const roundResponse = await CompRoundDataService.findByCompId(this.selectedCompId);
        this.compRounds = roundResponse.data;
        await  this.updateSelectedCompetition();
      } catch (error) {
        console.error("ERROR round {}", error);
      }
    },


    async saveCompRound(compRound) {

      console.log("saveCompRound", JSON.stringify(compRound));
      this.selectedCompId = compRound.compId;
      this.isVisible = false;
      if (compRound.id) {
        // Update compRound
        try {
          const updated = await CompRoundDataService.update(compRound.id, compRound);
          if (updated.status===200) {
            this.message = "Änderungen wurden gespeichert."
            this.triggerMessage();
          }
          await this.updateSelectedCompetition();
          await this.retrieveRounds();
        } catch (error) {
          console.error("ERROR update round {}", error);
        }
      } else {
        try {
          const created = await CompRoundDataService.create(compRound);
          console.log("round created:", created.status);

          await this.updateSelectedCompetition();
          await this.retrieveRounds();
          if (created.status===201) {
            this.message = "Einträge wurden gespeichert."
            this.triggerMessage();
          }
        } catch (error) {
          console.error("ERROR update round {}", error);
          const data = saveMessage(error);
          this.errorMessage = data.errorMessage;
          this.errorDetails = data.errorDetails;
          this.message = data.message;
          if (this.errorMessage) {
            this.triggerAlert();

          }
        }
      }

      this.editingCompRound = null; // Clear editing state
    },

    createCompRound(payload) {
      this.editingCompRound = null;
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
    },

    editCompRound(payload) {
      this.editingCompRound = {...payload.compRound};// Create a copy to prevent direct mutation
      this.isVisible = true;
    },

    deleteCompRound(compRound) {
      if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        // If the user confirms, proceed with the deletion logic
        this.confirmDelete(compRound);
      }
    },

    confirmDelete(compRound) {
      CompRoundDataService.delete(compRound.id)
          .then(response => {
           this.retrieveRounds();
          })
          .catch(e => {
            console.error(e);
          });
    },
    triggerMessage() {
      console.log("trigger message:");
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


</script>
