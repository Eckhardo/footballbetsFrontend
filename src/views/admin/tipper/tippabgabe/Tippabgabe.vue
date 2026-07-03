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
      <tr v-for="(match) in matches" :key="match.id">
        <td>{{ match.anpfiffdate }}</td>
        <td>{{ match.heimTeamAcronym }}</td>
        <td>{{ match.gastTeamAcronym }}</td>
        <td>{{ match.heimTore }}:{{ match.gastTore }}</td>

      </tr>
      <tr v-if="matches.length === 0 && !loading">
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
import {ref, computed, onMounted, watch} from 'vue';
import axios from 'axios';
import MatchdayDataService from "../../../../service/competition/MatchdayDataService.js";

// --- Reaktive Zustände (State) ---
const matches = ref([]);

const totalMatchdays = ref(34);
const currentMatchday = ref(null);
const currentMatchdayNumber = ref(1);
const currentMatchdayId = ref(1);
const loading = ref(false);
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "../../../../stores/umsInfoStore.js";

const umsInfoStore = useUmsInfoStore();
const {defaultCompetitionId} = storeToRefs(umsInfoStore);
import {useError} from '../../../../composables/useError.js';
import {useMessage} from '../../../../composables/useMessage.js';
import {saveMessage} from "../../../../util/errorMessages.js";
import MatchDataService from "../../../../service/competition/MatchDataService.js";

const {setMessage} = useMessage();
const {setError} = useError();

// Paginierungs-Metriken

const perPage = ref(9);
let matchdays =[];

// --- API-Aufruf (Axios) ---
const fetchMatchdays = async () => {
  loading.value = true;

  console.log("Loading matchdays...", defaultCompetitionId.value);
  try {
    const matchdaysResponse = await MatchdayDataService.getMatchdaysByCompId(defaultCompetitionId.value);
    console.log("...loaded matchdays", matchdaysResponse.status);
    if (matchdaysResponse.status === 200) {

      matchdays = matchdaysResponse.data;
      console.log("...loaded matchdays", JSON.stringify(matchdaysResponse.data));
      if (matchdays.length > 0) {
        currentMatchday.value = matchdays[0];
        console.log("...currrent matchday:", JSON.stringify(currentMatchday.value));
        currentMatchdayId.value = currentMatchday.value.id;
        console.log("...currrent matchday id:", JSON.stringify(  currentMatchdayId.value ));
        currentMatchdayNumber.value = currentMatchday.value.spieltagNumber;
        totalMatchdays.value = matchdays.length;
        console.log("...currrent matchday:", currentMatchdayNumber.value);
        setMessage("Spieltage geladen");
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

const fetchMatchesForMatchday = async () => {
  console.log("fetchMatchesForMatchday");
  try {
    currentMatchday.value = getMatchdayById(currentMatchdayId.value);
    currentMatchday.value = getMatchdayByNumber(currentMatchdayNumber.value);
    if (currentMatchday.value) {}
    currentMatchdayId.value = currentMatchday.value.id;

    const matchesResponse = await MatchDataService.getAllByMatchdayId(currentMatchdayId.value);
    matches.value = matchesResponse.data;

    setMessage("Spieltag " + currentMatchdayNumber.value + " geladen");
  } catch (err) {
    console.error(err);
    //   setError(saveMessage(err));
  } finally {
    loading.value = false;

  }
}
// --- Event-Handler ---
const changeMatchday = (newMatchday) => {
  if (newMatchday >= 1 && newMatchday <= totalMatchdays.value) {

    currentMatchdayNumber.value = newMatchday;
  }
};
const getMatchdayById = (idToFind) => {
  console.log("selectedMatchday by id::",JSON.stringify(idToFind));

  console.log("myDays by id::",JSON.stringify(matchdays));
  const myDay= matchdays.find(matchday => matchday.id === idToFind);
  console.log("selectedMatchday::",JSON.stringify(myDay));
  return myDay;
}

const getMatchdayByNumber = (numberToFind) => {
  console.log("selectedMatchday by number::",JSON.stringify(numberToFind));
  const myDay = matchdays.find(matchday => matchday.spieltagNumber === numberToFind);
  console.log("selectedMatchday::",JSON.stringify(myDay));
  return myDay;
}
const handlePerPageChange = () => {
  // Wenn die Zeilenanzahl geändert wird, springen wir zurück auf Seite 1
  currentMatchdayNumber.value = 1;
  fetchMatchdays();
};

// --- Watcher & Lifecycles ---
// Sobald sich die aktuelle Seite ändert, werden die Daten neu geladen
watch(currentMatchdayNumber, () => {
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
