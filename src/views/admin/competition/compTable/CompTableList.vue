<template>
  <div class="card">
    <!-- Global Error Message -->

    <ShowError v-bind:show-alert="showAlert"
               v-bind:message="message"
               v-bind:error-message="errorMessage"
               v-bind:error-details="errorDetails"/>

    <div v-if="selectedComp" class="card-header fw-bold">
      Tabelle der {{ selectedComp.name }}
    </div>
    <div v-if="spieltage" class="mb-3  p-3 border rounded">

      <label for="matchdayId" class="form-label fw-bold">Spieltag auswählen:</label>
      <!-- Use Bootstrap's form-select class for styling -->
      <form>
        <select id="matchdayId" class="form-select w-auto" v-model="selectedSpieltag" @change="handleSpieltagChange">
          <option v-for="spieltag in spieltage" :value="spieltag" :key="spieltag.id">
            {{ spieltag.spieltagNumber }}. Spieltag
          </option>
        </select>
      </form>
    </div>

    <div class="row mb-3  p-3">
      <div class="col-auto">
        <button class="btn btn-warning btn-sm me-2" @click="handleTableChange"><b>Tabelle</b></button>
      </div>
      <div class="col-auto">
        <button class="btn btn-warning btn-sm me-2" @click="handleHeimGastChange"><b>Heim/Auswärts</b></button>
      </div>
      <div class="col-auto">
        <button class="btn btn-warning btn-sm me-2" @click="handleRundeChange"><b>Hin-/Rückrunde</b></button>
      </div>
    </div>
    <div v-if="compTableRows.length>0" class="card-body">
      <div v-if="twoTables && heimGast" class="card-header fw-bold">
        Heim Tabelle der {{ selectedComp.name }}
      </div>
      <div v-if="twoTables && !heimGast" class="card-header fw-bold">
        Hinrunden Tabelle der {{ selectedComp.name }}
      </div>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Platz</th>
          <th>Team</th>
          <th>Sp.</th>
          <th>S</th>
          <th>R</th>
          <th>N</th>
          <th>Tore</th>
          <th>Diff</th>
          <th>Punkte</th>

        </tr>
        </thead>
        <tbody>
        <tr v-for="(compTableRow, index)  in compTableRows" :key="compTableRow.teamName">
          <td>{{ index + 1 }}</td>
          <td><b>{{ compTableRow.teamName }}</b></td>
          <td>{{ compTableRow.spieltage }}</td>
          <td>{{ compTableRow.gamesWon }}</td>
          <td>{{ compTableRow.gamesRemis }}</td>
          <td>{{ compTableRow.gamesLost }}</td>
          <td>{{ compTableRow.heimtore }}:{{ compTableRow.gasttore }}</td>
          <td>{{ compTableRow.difftore }}</td>

          <td style="color:crimson"><b>{{ compTableRow.points }}</b></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="twoTables && heimGast" class="card-header fw-bold">
     Auswärts Tabelle der {{ selectedComp.name }}
    </div>
    <div v-if="twoTables && !heimGast" class="card-header fw-bold">
      Rückrunden Tabelle der {{ selectedComp.name }}
    </div>
    <div v-if="twoTables" class="card-body">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Platz</th>
          <th>Team</th>
          <th>Sp.</th>
          <th>S</th>
          <th>R</th>
          <th>N</th>
          <th>Tore</th>
          <th>Diff</th>
          <th>Punkte</th>

        </tr>
        </thead>
        <tbody>
        <tr v-for="(compTableRow2, index)  in compTableRows2" :key="compTableRow2.teamName">
          <td>{{ index + 1 }}</td>
          <td><b>{{ compTableRow2.teamName }}</b></td>
          <td>{{ compTableRow2.spieltage }}</td>
          <td>{{ compTableRow2.gamesWon }}</td>
          <td>{{ compTableRow2.gamesRemis }}</td>
          <td>{{ compTableRow2.gamesLost }}</td>
          <td>{{ compTableRow2.heimtore }}:{{ compTableRow2.gasttore }}</td>
          <td>{{ compTableRow2.difftore }}</td>
          <td style="color:crimson"><b>{{ compTableRow2.points }}</b></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {saveMessage} from "@/util/errorMessages.js";
import CompTableDataService from "@/service/competition/CompTableDataService.js";
import CompDataService from "@/service/competition/CompDataService.js";
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";
import CompRoundDataService from "@/service/competition/CompRoundDataService.js";
import ShowError from "@/components/admin/competition/ShowError.vue";


export default {
  name: "CompTableList",
  components: {ShowError},

  mounted() {
    console.log("mounted: set compId from pinia to local writable id");
    this.selectedCompId = this.compId;
    this.retrieveData();
    this.retrieveTable();
  },
  beforeUnmount() {
    if (this.timer) clearTimeout(this.timer);
  },
  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compId: 'defaultCompetitionId'}),
  },
  data() {
    return {
      compTableRows: Array,
      compTableRows2: Array,
      twoTables: false,
      heimGast:false,
      selectedComp: null,
      selectedCompId: null,
      spieltage: Array,
      selectedSpieltag: null,
      selectedSpieltagNumber: 10,
      errorMessage: '',
      message: null,
      errorDetails: null, // Stores the full ProblemDetails object
      showAlert: false,// For validation errors (often in 'properties' or 'errors')
    };
  },
  methods: {

    async retrieveData() {
      console.log("retrieve Data");

      try {
        const compResponse = await CompDataService.get(this.selectedCompId);
        this.selectedComp = compResponse.data;
      } catch (error) {
        console.error("ERROR retrieve competition");
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();

        }
      }


      try {
        const spieltagResponse = await MatchdayDataService.getMatchdaysByCompId(this.selectedCompId);
        this.spieltage = spieltagResponse.data;
        if (this.spieltage.length > 0) {
          this.selectedSpieltag = this.spieltage[0];
        }


      } catch (error) {
        console.error("ERROR retrieve spieltage");
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();

        }
      }

    },
    async retrieveTable() {

      try {
        const compTableResponse = await CompTableDataService.findByCompId(this.selectedCompId, 1, this.selectedSpieltagNumber, null);
        this.compTableRows = compTableResponse.data;
        this.twoTables = false;

      } catch (error) {
        console.error("ERROR retrieve table");
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();

        }
      }
    },
    async retrieveRundenTable() {
      console.log("retrieveRundenTable");
      try {


        const responseRound = await CompRoundDataService.findByCompId(this.selectedCompId);
        const compRounds = responseRound.data;
        for (let i = 0; i < compRounds.length; i++) {
          console.log("iterate rounds");
          const roundId = compRounds[i].id;
          const responseMatchday = await MatchdayDataService.getMatchdaysByRoundId(roundId);
          const matchdays = responseMatchday.data;
          matchdays.sort((a, b) => a.spieltagNumber - b.spieltagNumber);
          const firstMatchday = matchdays.at(0);
          const lastMatchday = matchdays.at(-1);
          console.log(" first %s and last %s ", firstMatchday.spieltagNumber, lastMatchday.spieltagNumber);
          if (i === 0) {
            const compTableResponse = await CompTableDataService.findByCompId(this.selectedCompId, firstMatchday.spieltagNumber, lastMatchday.spieltagNumber, null);
            this.compTableRows = compTableResponse.data;
          } else if (i === 1) {
            const compTableResponse2 = await CompTableDataService.findByCompId(this.selectedCompId, firstMatchday.spieltagNumber, lastMatchday.spieltagNumber, null);
            this.compTableRows2 = compTableResponse2.data;
            this.twoTables = true;
            this.heimGast=false;

          } else {
            // do nothing
          }
        }


      } catch (error) {
        console.error("ERROR retrieve round table", error);
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();

        }
      }

    },
    async retrieveHeimGastTable() {

      try {
        const compTableResponseHeim = await CompTableDataService.findByCompId(this.selectedCompId, 1, this.selectedSpieltagNumber, true);
        this.compTableRows = compTableResponseHeim.data;
        const compTableResponseGast = await CompTableDataService.findByCompId(this.selectedCompId, 1, this.selectedSpieltagNumber, false);
        this.compTableRows2 = compTableResponseGast.data;
        this.twoTables = true;
        this.heimGast=true;

      } catch (error) {
        console.error("ERROR retrieve table");
        const data = saveMessage(error);
        this.errorMessage = data.errorMessage;
        this.errorDetails = data.errorDetails;
        this.message = data.message;
        if (this.errorMessage) {
          this.triggerAlert();

        }
      }
    },
    async handleSpieltagChange() {
      this.selectedSpieltagNumber = this.selectedSpieltag.spieltagNumber;
      await this.retrieveTable();
    },
    async handleTableChange() {
      this.selectedSpieltagNumber = this.selectedSpieltag.spieltagNumber;
      await this.retrieveTable();
    },
    async handleRundeChange() {
      this.selectedSpieltagNumber = this.selectedSpieltag.spieltagNumber;
      await this.retrieveRundenTable();
    },
    async handleHeimGastChange() {
      this.selectedSpieltagNumber = this.selectedSpieltag.spieltagNumber;
      await this.retrieveHeimGastTable();
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

  }
}
</script>
<style scoped>

</style>