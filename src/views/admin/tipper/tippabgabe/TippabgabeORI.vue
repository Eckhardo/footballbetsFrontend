<template>
  <div class="datatable-container">
    <!-- Status-Anzeigen -->
    <div v-if="loading" class="loading-overlay">Daten werden geladen...</div>

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
        <td>{{ match.heimName }}</td>
        <td>{{ match.gastName }}</td>
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
            :disabled="currentMatchdayNumber === 1 || loading"
            @click="changeMatchday(1)"
        >
          &laquo; Erste
        </button>
        <button
            :disabled="currentMatchdayNumber === 1 || loading"
            @click="changeMatchday(currentMatchdayNumber - 1)"
        >
          &lsaquo; Zurück
        </button>

        <span class="page-info">
          Spieltag <strong>{{ currentMatchdayNumber }}</strong> von <strong>{{ totalMatchdays }}</strong>
          ({{ totalMatchdays }} Einträge gesamt)
        </span>

        <button
            :disabled="currentMatchdayNumber === totalMatchdays || loading"
            @click="changeMatchday(currentMatchdayNumber + 1)"
        >
          Weiter &rsaquo;
        </button>
        <button
            :disabled="currentMatchdayNumber === totalMatchdays || loading"
            @click="changeMatchday(totalMatchdays)"
        >
          Letzte &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";

import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

const umsInfoStore = useUmsInfoStore();
const {defaultCompetitionId, defaultCommunityId, defaultCommMembId} = storeToRefs(umsInfoStore);

import {useError} from '@/composables/useError.js';
import {useMessage} from '@/composables/useMessage.js';
import {saveMessage} from "@/util/errorMessages.js";
import TippModusDataService from "@/service/tipps/TippModusDataService.js";
import TippDataService from "@/service/tipps/TippDataService.js";

const {setMessage} = useMessage();
const {setError} = useError();

// Paginierungs-Metriken

const totalMatchdays = ref(34);
const currentMatchday = ref(null);
const currentMatchdayNumber = ref(1);
const currentMatchdayId = ref(1);
const loading = ref(false);
const formData = ref(
    {
      matchdays: [],
      matches: [],
      tippModusType: ''
    }
)
// --- Reaktive Zustände (State) ---


// --- API-Aufruf (Axios) ---
const fetchMatchdays = async () => {
  loading.value = true;

  console.log("Loading matchdays for comp.", defaultCompetitionId.value);
  try {
    const matchdaysResponse = await MatchdayDataService.getMatchdaysByCompId(defaultCompetitionId.value);
    if (matchdaysResponse.status === 200) {
      formData.value.matchdays = matchdaysResponse.data;
      console.log("Loaded matchdays for comp.", JSON.stringify(formData.value.matchdays.length));
      if (formData.value.matchdays.length > 0) {

        currentMatchday.value = formData.value.matchdays[0];
        console.log("currentMatchday", currentMatchday.value);
        currentMatchdayId.value = currentMatchday.value.id;
        currentMatchdayNumber.value = currentMatchday.value.spieltagNumber;
        console.log("matchdays geladen.");
        await retrieveTippModi();
        await fetchMatchesForMatchday();
      }
    }
  } catch (err) {
    console.error("ERROR retrieve data");
    setError(saveMessage(err));
  } finally {
    loading.value = false;
  }
};

const retrieveTippModi = async () => {
  console.info("retrieveTippModi()", defaultCommunityId.value);
  try {
    const response = await TippModusDataService.getModiForCommunity(defaultCommunityId.value);
    if (response.status === 200) {
      formData.value.tippModi = response.data;
      if (formData.value.tippModi.length > 0) {
        formData.value.tippModusType = formData.value.tippModi[0].type;

      }
      loading.value = true;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const fetchMatchesForMatchday = async () => {
  console.log("fetchMatchesForMatchday");
  try {
    currentMatchday.value = getMatchdayById(currentMatchdayId.value);
    currentMatchday.value = getMatchdayByNumber(currentMatchdayNumber.value);
    currentMatchdayId.value =currentMatchday.value.id;
    console.log("findTippRowsForTipper");
    const matchesResponse = await TippDataService.findTippRowsForTipper(currentMatchdayId.value, defaultCommMembId.value);
    formData.value.matches = matchesResponse.data;

    setMessage("Spieltag " + currentMatchdayNumber.value + " geladen");
  } catch (err) {
    console.error(err);
    setError(saveMessage(err));
  } finally {
    loading.value = false;

  }
}
// --- Event-Handler ---
const changeMatchday = (newMatchday) => {
  console.log("chnageMatchday::", JSON.stringify(newMatchday));
  if (newMatchday >= 1 && newMatchday <= totalMatchdays.value) {
    currentMatchdayNumber.value = newMatchday;
    fetchMatchesForMatchday();
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
watch(currentMatchdayNumber.value, () => {
  fetchMatchesForMatchday();
});


// Initialer API-Aufruf beim Laden der Komponente
onMounted(() => {
  fetchMatchdays();


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
