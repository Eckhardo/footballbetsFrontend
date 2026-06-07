<template>
  <div class="container mt-5">

    <!-- Global Error Message -->

    <ShowError v-bind:show-alert="showAlert"
               v-bind:message="message"
               v-bind:error-message="errorMessage"
               v-bind:error-details="errorDetails"/>


    <!-- Team Form for Create/Update -->
    <TeamForm v-if="isVisible" v-bind:currentTeam="editingTeam"
              @save-team="saveTeam"/>

    <!-- Team List for Read/Delete/Edit -->
    <TeamList v-if="! isVisible" v-bind:teams="teams" v-bind:isClub="isClub"
              @create-team="createTeam"
              @edit-team="editTeam"
              @delete-team="deleteTeam"
              @show-clubs="showClubs"
              @show-nations="showNations"/>
  </div>
</template>

<script>
import TeamForm from "./TeamForm.vue";
import TeamList from "./TeamList.vue";
import TeamDataService from "@/service/competition/TeamDataService.js";
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {saveMessage} from "@/util/errorMessages.js";
import FamilyDataService from "@/service/competition/FamilyDataService.js";
import ShowError from "@/components/admin/competition/ShowError.vue";


export default {
  name: 'Teams',
  components: {
    ShowError,
    TeamList,
    TeamForm,

  },
  // Best practice: Clear timer if component is destroyed
  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  },
  mounted() {
    this.selectedCompId = this.compId;
    this.selectedCountry=this.country;
    this.retrieveTeams();

  },
  data() {
    return {

      teams: [],
      editingTeam: null,
      isVisible: false,
      isClub: true,
      errorMessage: '',
      errorDetails: null, // Stores the full ProblemDetails object
      showAlert: false,// For validation errors (often in 'properties' or 'errors')
    };
  },

  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn',country:'defaultCountry', compId: 'defaultCompetitionId'}),
  },
  methods: {
    async retrieveTeams() {
      console.log("retrieveTeams for country", this.selectedCountry);
      try {
        const familyResponse = await FamilyDataService.findFamilyByCompId(this.selectedCompId);
        const selectedFamily = familyResponse.data;

        if (selectedFamily.hasClubs) {
          await this.retrieveClubs();
          this.isClub = true;

        } else {
          await this.retrieveNations();
          this.isClub = false;
        }
      } catch (error) {
        console.error("ERROR teams{}", error);
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();
        }
      }
    },
    async retrieveClubs() {
      console.log("retrieveClubs");
      try {
        const response = await TeamDataService.getAllForClubs();
        this.teams = response.data;
      } catch (error) {
        console.error("ERROR clubs{}", error);
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();
        }
      }
    },
    async retrieveNations() {
      console.log("retrieveNations");
      try {
        const response = await TeamDataService.getAllForNations();
        this.teams = response.data;
      } catch (error) {
        console.error("ERROR nations{}", error);
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();
        }
      }
    },

    saveTeam(team) {
      console.log("saveTeam", JSON.stringify(team));
      this.isVisible = false;

      if (team.id) {
        // Update compRound
        TeamDataService.update(team.id, team)
            .then(response => {
              console.log(response.status);
              this.retrieveTeams();
            })
            .catch(e => {
              console.log(e);
            });
      } else {
        {
          console.log("create new team", JSON.stringify(team));
          TeamDataService.create(team)
              .then(response => {
                console.log(response.status);
                this.retrieveTeams();
              })
              .catch(error => {
                const data = saveMessage(error);
                this.errorMessage = data.errorMessage;
                this.errorDetails = data.errorDetails;
                if (this.errorMessage) {
                  this.triggerAlert();

                }
              });
        }
      }
      this.editingTeam = null; // Clear editing state
    },
    showClubs() {
      console.log("showClubs");
      this.isClub = true;
      this.retrieveClubs();

    },
    showNations() {
      console.log("showNations");
      this.isClub = false;
      this.retrieveNations();
    },
    createTeam(payload) {
      console.log("creating team", JSON.stringify(payload));
      // Set the compFamily to be edited in the form
      this.editingTeam = null;
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
    },
    editTeam(payload) {
      console.log("editing team", JSON.stringify(payload));
      // Set the compRound to be edited in the form
      this.editingTeam = {...payload.team};// Create a copy to prevent direct mutation
      this.isVisible = true;
    },
    deleteTeam(team) {

      console.log("deleting team ", JSON.stringify(team));

      if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        // If the user confirms, proceed with the deletion logic
        this.confirmDelete(team);
      }
    },
    confirmDelete(team) {
      TeamDataService.delete(team.id)
          .then(response => {
            console.log(response.status);
            this.retrieveTeams();
          })
          .catch(e => {
            console.log(e);
          });
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

};
</script>
>