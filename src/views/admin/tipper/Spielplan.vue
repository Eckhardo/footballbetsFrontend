<template>
  <div class="datatable-container">
    <!-- Status-Anzeigen -->
    <div v-if="loading" class="loading-overlay">Daten werden geladen...</div>

    <!-- Die Datentabelle -->
    <table class="custom-table">
      <thead>
      <tr>
        <th>Spieltag</th>
        <th>Anpfiff</th>
        <th>Heim</th>
        <th>Gast</th>
        <th>HeimTore</th>
        <th>GastTore</th>
        <th>stattgefunden</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(match) in matches" :key="match.id">
        <td>{{ match.spieltagNumber }}</td>
        <td>{{ match.anpfiffdate }}</td>
        <td>{{ match.heimTeamAcronym }}</td>
        <td>{{ match.gastTeamAcronym }}</td>
        <td>{{ match.heimTore }}</td>
        <td>{{ match.gastTore }}</td>
      </tr>
      <tr v-if="matches.length === 0 && !loading">
        <td colspan="4" class="no-data">Keine Einträge gefunden.</td>
      </tr>
      </tbody>
    </table>

    <!-- Paginator / Steuerungselemente -->
    <div class="paginator-controls" >
      <div class="per-page-selector">
        <label for="perPage">Einträge pro Seite:</label>
        <select id="perPage" v-model="perPage" @change="handlePerPageChange">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>

      <div class="pagination-buttons">
        <button
            :disabled="currentPage === 1 || loading"
            @click="changePage(1)"
        >
          &laquo; Erste
        </button>
        <button
            :disabled="currentPage === 1 || loading"
            @click="changePage(currentPage - 1)"
        >
          &lsaquo; Zurück
        </button>

        <span class="page-info">
          Seite <strong>{{ currentPage }}</strong> von <strong>{{ totalPages }}</strong>
          ({{ totalItems }} Einträge gesamt)
        </span>

        <button
            :disabled="currentPage === totalPages || loading"
            @click="changePage(currentPage + 1)"
        >
          Weiter &rsaquo;
        </button>
        <button
            :disabled="currentPage === totalPages || loading"
            @click="changePage(totalPages)"
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
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";

// --- Reaktive Zustände (State) ---
const matches = ref([]);
const matchdays = ref([]);
const selectedMatchday = ref(null);
const matchdayId = ref(1);
const loading = ref(false);
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

const umsInfoStore = useUmsInfoStore();
const {defaultCompetitionId} = storeToRefs(umsInfoStore);
import {useError} from '@/composables/useError';
import {useMessage} from '@/composables/useMessage';
import {saveMessage} from "@/util/errorMessages.js";
import MatchDataService from "../../../service/competition/MatchDataService.js";

const {setMessage} = useMessage();
const {setError} = useError();

// Paginierungs-Metriken
const currentPage = ref(1);
const perPage = ref(10);
const totalItems = ref(0);

// Berechnete Eigenschaft für die gesamte Seitenanzahl
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / perPage.value) || 1;
});

// --- API-Aufruf (Axios) ---
const fetchData = async () => {
  loading.value = true;

console.log("Loading matchdays...", defaultCompetitionId.value);
  try {
    const matchdaysResponse = await MatchdayDataService.getMatchdaysByCompId(defaultCompetitionId.value);
    console.log("...loaded matchdays", matchdaysResponse.status);
    if (matchdaysResponse.status === 200) {
      console.log("...loaded matchdays2", matchdaysResponse.status);
      setMessage("Spieltage geladen");
      matchdays.value = matchdaysResponse.data;
      if (matchdays.value.length > 0) {
        console.log("...loaded matchdays", matchdays.value.length);
        selectedMatchday.value = matchdays.value[0];
        matchdayId.value = selectedMatchday.value.id;
        console.log("...loaded matches", matchdayId.value);
        const matchesResponse = await MatchDataService.getAllByMatchdayId(matchdayId.value);
        matches.value = matchesResponse.data;

      }
     }


  } catch (err) {
    console.error("ERROR retrieve data");
    setError(saveMessage(err));
  } finally {
    loading.value = false;
  }
};

// --- Event-Handler ---
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

const handlePerPageChange = () => {
  // Wenn die Zeilenanzahl geändert wird, springen wir zurück auf Seite 1
  currentPage.value = 1;
  fetchData();
};

// --- Watcher & Lifecycles ---
// Sobald sich die aktuelle Seite ändert, werden die Daten neu geladen
watch(currentPage, () => {
  fetchData();
});

// Initialer API-Aufruf beim Laden der Komponente
onMounted(() => {
  fetchData();
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
