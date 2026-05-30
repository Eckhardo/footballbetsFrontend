<template>
  <div v-if="loggedIn" class="container mt-5">
    <ShowMessage v-bind:message="message" v-bind:showMessage="showMessage"/>
    <!-- Global Error Message -->
    <ShowError v-bind:show-alert="showAlert"
               v-bind:message="message"
               v-bind:error-message="errorMessage"
               v-bind:error-details="errorDetails"/>

    <!-- Competition Form for Create/Update -->
    <CompForm v-if="isVisible"
              v-bind:current-competition="editingCompetition"
              v-bind:families="families"
              v-bind:selected-family="selectedFamily"
              @save-competition="saveCompetition"/>

    <!-- Competition List for Read/Delete/Edit -->
    <CompList v-if="! isVisible && selectedFamily!==null" :competitions="competitions"
              v-bind:families="families"
              v-bind:selected-family="selectedFamily"
              @select-family="retrieveCompsForFamily"
              @create-competition="createCompetition"
              @edit-competition="editCompetition"
              @delete-competition="deleteCompetition"/>
  </div>
</template>

<script>
import CompList from './CompList.vue';
import CompForm from './CompForm.vue';
import CompDataService from "@/service/competition/CompDataService.js";
import FamilyDataService from "@/service/competition/FamilyDataService.js";
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {saveMessage} from "@/util/errorMessages.js";
import ShowError from "@/components/ShowError.vue";
import ShowMessage from "@/components/ShowMessage.vue";


export default {
  name: 'Competitions',
  components: {
    ShowMessage,
    ShowError,
    CompList,
    CompForm
  },
  mounted() {
    console.log("mounted: set compId from pinia to local writable id");
    this.selectedCompId = this.compId;
    this.retrieveData();

    this.retrieveCompetitions();

  },

  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compId: 'defaultCompetitionId'}),
  },
  data() {
    return {
      families: [],
      selectedFamily: null,
      competitions: [],
      editingCompetition: null,
      selectedCompId: null,
      selectedFamId: null,
      isVisible: false,
      errorMessage: null,
      errorDetails: null,
      message: null,// Stores the full ProblemDetails object
      showAlert: false,// For validation errors (often in 'properties' or 'errors')
      showMessage:false

    };
  },
  methods: {

    async updateSelectedFamily() {
      for (const fam of this.families) {
        if (fam.id === this.selectedFamId) {
          this.selectedFamily = fam;
          console.log("updated selected fam::", JSON.stringify(this.selectedFamily));
          break;
        }
      }
    },

    async retrieveData() {
      console.log("retrieveFamilies");
      try {

        const famResponse = await FamilyDataService.getAll();
        this.families = famResponse.data;
        const familyResponse = await FamilyDataService.findFamilyByCompId(this.selectedCompId);
        this.selectedFamily = familyResponse.data;
        this.selectedFamId = this.selectedFamily.id;
        const compResponse = await CompDataService.findAllCompsByFamId(this.selectedFamId);
        this.competitions = compResponse.data;
      } catch (error) {
        console.log("ERROR findByCompId {}", error);
      }
    },
    async retrieveCompetitions() {
      console.log("retrieveCompetitions");
      try {
        const compResponse = await CompDataService.findAllCompsByFamId(this.selectedFamId);
        this.competitions = compResponse.data;
      } catch (error) {
        console.log("ERROR comps {}", error);
      }

    },
    async retrieveCompsForFamily(payload) {
      this.selectedFamId = payload.familyId;
      console.log("retrieveCompsForFamily", JSON.stringify(payload));
      try {
        const compResponse = await CompDataService.findAllCompsByFamId(payload.familyId);
        this.competitions = compResponse.data;
        await this.updateSelectedFamily();
      } catch (error) {
        console.error("ERROR comps {}", error);
      }
    },

    async saveCompetition(competition) {
      this.isVisible = false;
      this.selectedFamId = competition.familyId;
      console.log("saveCompetition:", JSON.stringify(competition));
      if (competition.id) {
        // Update competition
        try {
          const response = await CompDataService.update(competition.id, competition);
          if (response.status === 200) {
            await this.retrieveCompetitions();
            await this.updateSelectedFamily();
            this.message = "Änderungen wurden gespeichert."
            this.triggerMessage();
          }
        } catch (error) {
          console.log("ERROR update {}", error);
        }
      } else {
        try {
          const response = await CompDataService.create(competition);
          if (response.status === 201) {
            await this.retrieveCompetitions();
            await this.updateSelectedFamily();
            this.message = "Einträge wurden gespeichert."
            this.triggerMessage();
          }
        } catch (error) {
          console.error("ERROR save competition");
          const data = saveMessage(error);
          this.errorMessage = data.errorMessage;
          this.errorDetails = data.errorDetails;
          this.message = data.message;
          if (this.errorMessage) {
            this.triggerCompAlert();

          }
        }
      }
      this.editingCompetition = null; // Clear editing state
    },

    editCompetition(payload) {
      console.log("editing competition", JSON.stringify(payload));
      // Set the competition to be edited in the form
      this.editingCompetition = {...payload.competition};
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
    },
    createCompetition(payload) {
      console.log("creating competition", JSON.stringify(payload));
      // Set the compFamily to be edited in the form
      this.editingCompetition = null;
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
    },
    deleteCompetition(competition) {

      console.log("deleting competition ", JSON.stringify(competition));
      // Delete competition
      //   const toDelete = this.competitions.find(competition => competition.id !== competitionId);
      //  console.log("deleting competition", JSON.stringify(toDelete));
      if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        // If the user confirms, proceed with the deletion logic
        this.confirmDelete(competition);
      }
    },
    confirmDelete(competition) {
      CompDataService.delete(competition.id)
          .then(response => {
            console.log(response.status);
            this.retrieveCompetitions();
          })
          .catch(e => {
            console.log(e);
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
    triggerCompAlert() {
      // Clear any existing timer to reset the duration if clicked again
      if (this.timer) clearTimeout(this.timer);

      this.showAlert = true;

      // Hide after 5000ms (5 seconds)
      this.timer = setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    },
// Best practice: Clear timer if component is destroyed
    beforeUnmount() {
      if (this.timer) clearTimeout(this.timer);
    }
  }
}
</script>
<style scoped>
</style>