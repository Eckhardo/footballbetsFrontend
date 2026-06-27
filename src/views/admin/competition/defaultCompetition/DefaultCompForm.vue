<template>

  <!-- Global Error Message -->
  <ShowMessage v-bind:message="message" v-bind:showMessage="showMessage"/>
  <div class="card mb-4 " v-if="loggedIn">
    <div class="card-header  fs-5 ">
      Standards setzen
    </div>
    <div class="card-body ">
      <form @submit.prevent="handleSubmit">

        <div class="mb-3  p-3 border rounded">
          <div>
            <label for="familyId" class="form-label  fw-bold">Wähle den Sport-Event:</label>
            <!-- Use Bootstrap's form-select class for styling -->
            <select id="familyId" class="form-select  w-auto border border-3 " v-model="selectedCompFamily"
                    @change="handleFamilyChange" required>
              <option v-for="family in compFamilies" :value="family" :key="family.id">
                {{ family.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="mb-3  p-3 border rounded" v-if="competitions!=null">
          <div>
            <label for="compId" class="form-label  fw-bold">Wähle den Wettbewerb:</label>
            <!-- Use Bootstrap's form-select class for styling -->
            <select id="compId" class="form-select  w-auto border border-3 " v-model="selectedCompetition"
                    @change="handleCompetitionChange" required>
              <option v-for="comp in competitions" :value="comp" :key="comp.id">
                {{ comp.name }}
              </option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="isProcessing">
          Standards setzen
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import FamilyDataService from "@/service/competition/FamilyDataService.js";
import {mapActions, mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import CompDataService from "@/service/competition/CompDataService.js";

import ShowMessage from "@/components/admin/competition/ShowMessage.vue";


export default {
  name: 'DefaultCompForm',
  components: {ShowMessage},
  setup() {
    const umsInfoStore = useUmsInfoStore()
    return {umsInfoStore}
  },
  mounted() {
    this.selectedCompId = this.compId;
    this.retrieveCompFamilies();


  },

  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compId: 'defaultCompetitionId'}),
  },
  data() {
    return {
      form: {
        familyId: null,
        familyName: null,
        competitionId: null,
        competitionName: null
      },
      compFamilies: [],
      selectedCompFamily: null,
      selectedFamId: null,
      competitions: [],
      selectedCompetition: null,
      selectedCompId: null,
      errorMessage: null,
      errorDetails: null, // Stores the full ProblemDetails object
      message: null,
      showAlert: false,
      isProcessing: false,// For validation errors (often in 'properties' or 'errors')
      showMessage: false,
    };
  },
  methods: {
    ...mapActions(useUmsInfoStore, ['setCompId']),

    changeDefaultCompetition(id) {
      this.umsInfoStore.setCompId(id) // Calls the store action
      this.message = "Einträge wurden gespeichert."
      this.triggerMessage();
    },

    async retrieveCompFamilies() {
      try {
        const response = await FamilyDataService.getAll();
        this.compFamilies = response.data;
        console.log("Getting all Families::", this.compFamilies.length);
        await this.retrieveCompetitions();

      } catch (error) {
        console.error("ERROR retrieve fams");
      }
    },
    async retrieveCompFamily(famId) {
      console.log("retrieveCompFamily");
      try {
        const response = await FamilyDataService.get(famId);
        if (response.status === 200) {
          this.selectedCompFamily = response.data;
          this.form.familyId = this.selectedCompFamily.id;
          this.form.familyName = this.selectedCompFamily.name;
          console.log("retrieved CompFamily:", JSON.stringify(this.selectedCompFamily));
          for (const comp of this.competitions) {
            if (comp.familyId === this.form.familyId) {
              this.selectedCompetition = comp;

            }
          }
        }
      } catch (error) {
        console.error("ERROR retrieve fams");
      }
    },
    async retrieveCompetitions() {
      console.log("retrieveCompetitions");
      try {
        const compResponse = await CompDataService.getAll()
        this.competitions = compResponse.data;
        if (this.competitions.length > 0) {
          for (const comp of this.competitions) {
            if (comp.id === this.selectedCompId) {
              console.log("selectedComp", JSON.stringify(comp));
              this.selectedCompetition = comp;
              this.selectedFamId = comp.familyId;
            }
          }
        }
        if (this.compFamilies.length > 0) {
          for (const fam of this.compFamilies) {
            if (fam.id === this.selectedFamId) {
              console.log("selectedFam", JSON.stringify(fam));
              this.selectedCompFamily = fam;

            }
          }
        }
      } catch (error) {
        console.log("ERROR comps {}", error);
      }

    },
    async handleFamilyChange() {
      console.log("handleFamilyChange2", JSON.stringify(this.selectedCompFamily));

      await this.retrieveCompFamily(this.selectedCompFamily.id);

    },
    async handleCompetitionChange(event) {
      this.form.competitionId = this.selectedCompetition.id;
      this.form.competitionName = this.selectedCompetition.name;

    },
    handleSubmit() {
      this.isProcessing = true; // Freeze the button
      console.log("handleSubmit::", JSON.stringify(this.selectedCompetition));

      this.changeDefaultCompetition(this.selectedCompetition.id);

      this.isProcessing = false;
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

}
</script>

<style scoped>

</style>