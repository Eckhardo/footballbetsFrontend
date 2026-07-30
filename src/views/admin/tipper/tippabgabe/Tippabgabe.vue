<template>
  <div class="datatable-container">
    <!-- Status-Anzeigen -->
    <div v-if="formData.loading" class="loading-overlay">Daten werden geladen...</div>

    <!-- Die Datentabelle -->
    <table class="custom-table">
      <thead>
      <tr>
        <th>Anpfiff</th>
        <th>Heim</th>
        <th>Gast</th>
        <th>Ergebnis</th>
        <th>Punkteregel</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(match) in formData.matches" :key="match.id">
        <td>{{ match.anpfiffdate }}</td>
        <td>{{ match.heimTeamAcronym }}</td>
        <td>{{ match.gastTeamAcronym }}</td>
        <td>{{ match.heimTore }}:{{ match.gastTore }}</td>

      </tr>
      <tr v-if="formData.matches.length === 0 && !loading">
        <td colspan="4" class="no-data">Keine Einträge gefunden.</td>
      </tr>
      </tbody>
    </table>

    <!-- Paginator / Steuerungselemente -->
    <div class="paginator-controls">


      <div class="pagination-buttons">
        <button
            :disabled="formData.currentMatchdayNumber === 1 || loading"
            @click="changeMatchday(1)"
        >
          &laquo; Erste
        </button>
        <button
            :disabled="formData.currentMatchdayNumber === 1 || loading"
            @click="changeMatchday(formData.currentMatchdayNumber - 1)"
        >
          &lsaquo; Zurück
        </button>

        <span class="page-info">
          Spieltag <strong>{{ formData.currentMatchdayNumber }}</strong> von <strong>{{ formData.totalMatchdays }}</strong>
          ({{ totalMatchdays }} Einträge gesamt)
        </span>

        <button
            :disabled="formData.currentMatchdayNumber === formData.totalMatchdays || formData.loading"
            @click="changeMatchday(formData.currentMatchdayNumber + 1)"
        >
          Weiter &rsaquo;
        </button>
        <button
            :disabled="formData.currentMatchdayNumber === formData.totalMatchdays || formData.loading"
            @click="changeMatchday(formData.totalMatchdays)"
        >
          Letzte &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import axios from 'axios';
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";

import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

const umsInfoStore = useUmsInfoStore();
const {defaultCompetitionId,defaultCommunityId} = storeToRefs(umsInfoStore);
import {useError} from '@/composables/useError.js';
import {useMessage} from '@/composables/useMessage.js';
import {saveMessage} from "@/util/errorMessages.js";
import MatchDataService from "@/service/competition/MatchDataService.js";
import TippModusDataService from "@/service/tipps/TippModusDataService.js";

const {setMessage} = useMessage();
const {setError} = useError();

// Paginierungs-Metriken

const formData = ref(
    {
      matchdays: [],
      currentMatchday: null,
      currentMatchdayNumber: null,
      currentMatchdayId: null,
      matches: [],
      loading: false,
      tippModusType:''
    }
)
// --- Reaktive Zustände (State) ---


// --- API-Aufruf (Axios) ---
const fetchMatchdays = async () => {
  formData.value.loading = true;

  console.log("Loading matchdays...", defaultCompetitionId.value);
  try {
    const matchdaysResponse = await MatchdayDataService.getMatchdaysByCompId(defaultCompetitionId.value);
    console.log("...loaded matchdays", matchdaysResponse.status);
    if (matchdaysResponse.status === 200) {

      formData.value.matchdays = matchdaysResponse.data;
      console.log("...loaded matchdays", JSON.stringify(matchdaysResponse.data));
      if (formData.value.matchdays.length > 0) {
        formData.value.currentMatchday = formData.value.matchdays[0];
        formData.value.currentMatchdayId = formData.value.currentMatchday.id;
        formData.value.currentMatchdayNumber = formData.value.currentMatchday.spieltagNumber;
        formData.value.totalMatchdays = formData.value.matchdays.length;
        setMessage("Spieltage geladen");
        await fetchMatchesForMatchday();
      }
    }
  } catch (err) {
    console.error("ERROR retrieve data");
    setError(saveMessage(err));
  } finally {
    formData.value.loading = false;
  }
};

const retrieveTippModi = async () => {
  console.info("retrieveTippModi()", defaultCommunityId.value);
  try {
    const response = await TippModusDataService.getModiForCommunity(defaultCommunityId.value);
    if (response.status === 200) {
      console.log(JSON.stringify(response.data));
      formData.value.tippModi = response.data;

      if (formData.value.tippModi.length > 0) {
        formData.value.tippModusType = formData.value.tippModi[0].type;

      }
      formData.value.loaded = true;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const fetchMatchesForMatchday = async () => {
  console.log("fetchMatchesForMatchday");
  try {
    formData.value.currentMatchday = getMatchdayById(formData.value.currentMatchdayId);
    formData.value.currentMatchday = getMatchdayByNumber(formData.value.currentMatchdayNumber);
    formData.value.currentMatchdayId = formData.value.currentMatchday.id;

    const matchesResponse = await MatchDataService.getAllByMatchdayId(formData.value.currentMatchdayId);
    formData.value.matches.value = matchesResponse.data;

    setMessage("Spieltag " + formData.value.currentMatchdayNumber + " geladen");
  } catch (err) {
    console.error(err);
    setError(saveMessage(err));
  } finally {
    formData.value.loading.value = false;

  }
}
// --- Event-Handler ---
const changeMatchday = (newMatchday) => {
  if (newMatchday >= 1 && newMatchday <= formData.value.totalMatchdays) {
    formData.value.currentMatchdayNumber = newMatchday;
  }
};
const getMatchdayById = (idToFind) => {
  console.log("selectedMatchday by id::", JSON.stringify(idToFind));
  const myDay = formData.value.matchdays.find(matchday => matchday.id === idToFind);
  console.log("selectedMatchday::", JSON.stringify(myDay));
  return myDay;
}

const getMatchdayByNumber = (numberToFind) => {
  console.log("selectedMatchday by number::", JSON.stringify(numberToFind));
  const myDay = formData.value.matchdays.find(matchday => matchday.spieltagNumber === numberToFind);
  console.log("selectedMatchday::", JSON.stringify(myDay));
  return myDay;
}

// --- Watcher & Lifecycles ---
// Sobald sich die aktuelle Seite ändert, werden die Daten neu geladen
watch(formData.value.currentMatchdayNumber, () => {
  fetchMatchesForMatchday();
});


// Initialer API-Aufruf beim Laden der Komponente
onMounted(() => {
  fetchMatchdays();
  retrieveTippModi();

});
</script>

<style scoped>
.datatable-container {
  font-family: sans-serif;
  margin: 20px auto;
  max-width: 1000px;
  position: relative;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.custom-table th, .custom-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.custom-table th {
  background-color: #f4f6f9;
  font-weight: bold;
}

.custom-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.loading-overlay {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.error-message {
  color: #d9534f;
  padding: 10px;
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  border-radius: 4px;
  margin-bottom: 15px;
}

.no-data {
  text-align: center;
  color: #777;
}

.paginator-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px 0;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
}

button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

button:disabled {
  background-color: #eaedf1;
  color: #949a9f;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #e6e6e6;
}

.page-info {
  margin: 0 10px;
  font-size: 14px;
}

select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-left: 5px;
}
</style>
