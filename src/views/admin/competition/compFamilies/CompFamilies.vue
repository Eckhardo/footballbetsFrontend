<template>
  <div v-if="loggedIn" class="container mt-5">
    <ShowMessage v-bind:message="message" v-bind:showMessage="showMessage"/>
    <ShowError v-bind:show-alert="showAlert"
               v-bind:message="message"
               v-bind:error-message="errorMessage"
               v-bind:error-details="errorDetails"/>
    <!-- Competition Family Form for Create/Update -->
    <CompFamilyForm v-if="isVisible" v-bind:current-comp-family="editingCompFamily" v-bind:countries="countries" @save-compFamily="saveCompFamily"/>

    <!-- CompFamily List for Read/Delete/Edit -->
    <CompFamilyList v-if="! isVisible" v-bind:comp-families="compFamilies" @create-compFamily="createCompFamily"
                    @edit-compFamily="editCompFamily"
                    @delete-compFamily="deleteCompFamily"/>
  </div>
</template>

<script>
import CompFamilyList from './CompFamilyList.vue';
import CompFamilyForm from './CompFamilyForm.vue';

import FamilyDataService from "@/service/competition/FamilyDataService.js";
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {saveMessage} from "@/util/errorMessages.js";
import ShowError from "@/components/ShowError.vue";
import ShowMessage from "@/components/ShowMessage.vue";


export default {
  name: 'CompFamilies',
  components: {
    ShowMessage,
    ShowError,
    CompFamilyList,
    CompFamilyForm
  },
  mounted() {
    this.retrieveCompFamilies();

  },

  computed: {
    ...mapState(useUmsInfoStore, ['username', 'loggedIn']),
  },
  data() {
    return {
      compFamilies: [],
      editingCompFamily: null,
      isVisible: false,
      errorMessage:null,
      errorDetails: null, // Stores the full ProblemDetails object
      message: null,
      showAlert: false,// For validation errors (often in 'properties' or 'errors')
      showMessage:false,
      countries:["GERMANY", "ENGLAND", "ITALY", "SPAIN"],
    };
  },
  methods: {
    async retrieveCompFamilies() {
      try {
        const response = await FamilyDataService.getAll();
        this.compFamilies = response.data;
      } catch (error) {
        console.error("ERROR retrieve fams");
      }
    },

    async saveCompFamily(compFamily) {
      console.log("save compFamily", JSON.stringify(compFamily));
      this.isVisible = false;
      if (compFamily.id) {
        // Update compFamily
        try {
          const response = await FamilyDataService.update(compFamily.id, compFamily);
          if (response.status === 200) {
            await this.retrieveCompFamilies();
            this.message = "Änderungen wurden gespeichert."
            this.triggerMessage();
          }
        } catch (e) {
          console.error("ERROR update fam round");
        }


      } else {
        {

          try {
            const response = await FamilyDataService.create(compFamily);
            if (response.status === 201) {
              await this.retrieveCompFamilies();
              this.message = "Einträge wurden gespeichert."
              this.triggerMessage();
            }
          } catch (error) {
            console.info("ERROR save fam ");
            const data = saveMessage(error);
            this.errorMessage=data.errorMessage;
            this.errorDetails =data.errorDetails;
            if (this.errorMessage){
              console.info("trigger alert ");
              this.triggerAlert();

            }

          }
        }
      }
      this.editingCompFamily = null; // Clear editing state
    },

    editCompFamily(payload) {
      console.log("editing compFamily", JSON.stringify(payload));
      // Set the compFamily to be edited in the form
      this.editingCompFamily = {...payload.compFamily};
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
    },
    createCompFamily(payload) {
      console.log("creating compFamily", JSON.stringify(payload));
      // Set the compFamily to be edited in the form
      this.editingCompFamily = null;
      this.isVisible = payload.isVisible// Create a copy to prevent direct mutation
    },
    deleteCompFamily(compFamily) {

      console.log("deleting compFamily ", JSON.stringify(compFamily));
      // Delete compFamily
      //   const toDelete = this.compFamilys.find(compFamily => compFamily.id !== compFamilyId);
      //  console.log("deleting compFamily", JSON.stringify(toDelete));
      if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
        // If the user confirms, proceed with the deletion logic
        this.confirmDelete(compFamily);
      }
    },
    confirmDelete(compFamily) {
      FamilyDataService.delete(compFamily.id)
          .then(response => {
            console.log(response.status);
            this.retrieveCompFamilies();
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
    triggerAlert() {
      // Clear any existing timer to reset the duration if clicked again
      if (this.timer) clearTimeout(this.timer);

      this.showAlert = true;

      // Hide after 5000ms (5 seconds)
      this.timer = setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
  },
  // Best practice: Clear timer if component is destroyed
  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }
}
;
</script>
