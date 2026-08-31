<template>
  <TippTableList v-if="!loading"   v-bind:tipp-rows="tippRows"
            v-bind:matchdays="matchdays" @change-matchday="changeMatchday"
            v-bind:current-matchday-number="selectedMatchdayNumber"/>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {useError} from '@/composables/useError.js';
import {useMessage} from '@/composables/useMessage.js';
import {saveMessage} from "@/util/errorMessages.js";
import TippTableDataService from "@/service/tipps/TippTableDataService.js";
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";
import {retrieveCurrentMatchday} from "@/util/TippUtil.js";
import TotoForm from "../tippabgabe/TotoForm.vue";
import TippTableList from "./TippTableList.vue";

const umsInfoStore = useUmsInfoStore();
const {defaultCompetitionId, defaultCommunityId} = storeToRefs(umsInfoStore);

const {setMessage} = useMessage();
const {setError} = useError();

const tippRows = ref([]);
const currentTimeStamp = ref(null);
const selectedMatchdayNumber = ref(1);
const loading = ref(false);
const matchdays = ref([]);
const totalMatchdays = ref(null);
const currentMatchday = ref(null);
const currentMatchdayId = ref(null);


// --- API-Aufruf (Axios) ---
const fetchMatchdays = async () => {
  loading.value = true;
  try {
    const matchdaysResponse = await MatchdayDataService.getMatchdaysByCompId(defaultCompetitionId.value);

    if (matchdaysResponse.status === 200) {
      matchdays.value = matchdaysResponse.data;
      totalMatchdays.value = matchdays.value.length;
      if (matchdays.value.length > 0) {
           await fetchTippOverview();
      }
    }
  } catch (err) {
    console.error(err.message);
    setError(saveMessage(err));
  }
}

const fetchTippOverview = async () => {
  console.log("fetchTippOverview");
  loading.value = true;
  try {

    if (selectedMatchdayNumber.value === null) {
      selectedMatchdayNumber.value= retrieveCurrentMatchday(matchdays.value);
    }
    currentMatchday.value = getMatchdayByNumber(selectedMatchdayNumber.value);
    currentMatchdayId.value = currentMatchday.value.id;
    const myResponse = await TippTableDataService.findTippTableForCommunity( defaultCommunityId.value,1,1);
    if (myResponse.status === 200) {
      console.log(JSON.stringify(myResponse.data));
      tippRows.value = myResponse.data;
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
    console.error(err);
    setError(saveMessage(err));
  }

}

const getMatchdayByNumber = (numberToFind) => {
  return matchdays.value.find(matchday => matchday.spieltagNumber === numberToFind);
}


// --- Event-Handler ---
const changeMatchday = (newMatchday) => {
  console.log("changeMatchday: ",newMatchday);
  if (newMatchday >= 1 && newMatchday <= totalMatchdays.value) {
    selectedMatchdayNumber.value = newMatchday;
    console.log("selectedMatchdayNumber.value: ",selectedMatchdayNumber.value);
    fetchTippOverview();
  }
};


// Initialer API-Aufruf beim Laden der Komponente
onMounted(() => {
  fetchMatchdays();
});
</script>
<style scoped>
.datatable-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
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