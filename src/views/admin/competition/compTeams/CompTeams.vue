<template>

  <ShowMessage v-bind:message="message" v-bind:showMessage="showMessage"/>
  <!-- Global Error Message -->

  <ShowError v-bind:show-alert="showAlert"
             v-bind:message="message"
             v-bind:error-message="errorMessage"
             v-bind:error-details="errorDetails"/>

  <div class="container mt-5">
    <CompTeamForm v-if="compTeams.length>0 && isVisible" v-bind:comp-teams="compTeams" @update-compTeams="updateCompTeams"/>
    <!-- Team List for Read/Delete/Edit -->
    <CompTeamList v-if="! isVisible && comp" v-bind:comp-teams="compTeams" v-bind:competition="comp" @create-compTeam="createCompTeam"/>
  </div>
</template>

<script>
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import CompTeamForm from "./CompTeamForm.vue";
import CompTeamList from "./CompTeamList.vue";
import CompTeamDataService from "@/service/competition/CompTeamDataService.js";
import PickList from 'primevue/picklist';
import CompDataService from "@/service/competition/CompDataService.js";
import {saveMessage} from "@/util/errorMessages.js";
import ShowMessage from "@/components/ShowMessage.vue";
import ShowError from "@/components/ShowError.vue";

export default {
  name: 'CompTeams',
  components: {
    ShowError,
    ShowMessage,
    CompTeamList,
    CompTeamForm,
    PickList
  },
  mounted() {

    this.retrieveCompTeams();

  },
  data() {
    return {
      comp: Object,
      compTeams: [],
      editingCompTeam: null,
      isVisible: false,
      selected: [],
      errorMessage: '',
      message: null,
      errorDetails: null, // Stores the full ProblemDetails object
      showAlert: false,// For validation errors (often in 'properties' or 'errors')
      showMessage:false
    };
  },
  watch: {
    compTeams: {
      handler(newItem) {
        if (newItem) {
          console.log("watch parent compTeams::", JSON.stringify(newItem[1]));

        }
      },
      immediate: true,
      deep: true
    }
  },

  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compId: 'defaultCompetitionId'}),
  },
  methods: {
    async retrieveCompTeams() {
      console.log("retrieve compTeams");
      try {
        const compResponse = await CompDataService.get(this.compId);
        this.comp = compResponse.data;
        const response = await CompTeamDataService.findAllRegAndUnregForComp(this.compId);
        this.compTeams = response.data;
        this.isVisible = false;

        console.log("retrieved ", JSON.stringify(this.compTeams, []));
      } catch (error) {
        console.error("ERROR retrieve competition teams");
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();
        }
      }
    },
    async updateCompTeams(payload) {
      console.log("parent update compTeams", JSON.stringify(payload.compTeams));
      this.compTeams = payload.compTeams;
      this.isVisible = false;
      try {
        const response = await CompTeamDataService.create(this.compTeams);
      if (response.status===201) {
        this.message = "Einträge wurden gespeichert."
        this.triggerMessage();
      }

      } catch (error) {
        console.error("ERROR save competition teams");
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();
        }
      }
      await this.retrieveCompTeams();
    },

    createCompTeam(payload) {
      console.log("creating compTeam", JSON.stringify(payload));
      // Set the compTeam to be edited in the form
      this.editingCompTeam = null;
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
    },
    triggerAlert() {
      // Clear any existing timer to reset the duration if clicked again
      if (this.timer) clearTimeout(this.timer);

      this.showAlert = true;

      // Hide after 5000ms (5 seconds)
      this.timer = setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    },
    triggerMessage() {
      // Clear any existing timer to reset the duration if clicked again
      if (this.timer) clearTimeout(this.timer);

      this.showMessage = true;

      // Hide after 5000ms (5 seconds)
      this.timer = setTimeout(() => {
        this.showMessage = false;
      }, 5000);
    }
  }

}
</script>
<style scoped>
.custom-picklist-width {
  max-width: 800px;
  margin: 0 auto;
}
</style>