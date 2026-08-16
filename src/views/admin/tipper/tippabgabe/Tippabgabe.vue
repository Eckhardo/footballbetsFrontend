<template>
  <div v-if=" formData.tippModus!==null">
{{ germanDate}}
    <TippModus v-bind:item="formData.tippModus"/>
    <TotoForm v-if="formData.tippModus.type==='TotoTipp' && !formData.loading" v-model="matches"
              v-bind:matchdays="formData.matchdays" @change-matchday="changeMatchday" @save-matches="saveAll"
              v-bind:current-matchday-number="selectedMatchdayNumber"
              v-bind:timestamp-now="currentTimeStamp"/>
    <PointForm v-if=" formData.tippModus.type==='PointTipp' && !formData.loading" v-model="matches"
               v-bind:matchdays="formData.matchdays" @change-matchday="changeMatchday" @save-matches="saveAll"
               v-bind:current-matchday-number="selectedMatchdayNumber"
               v-bind:timestamp-now="currentTimeStamp"/>
    <ResultForm v-if="formData.tippModus.type==='ResultTipp' && !formData.loading" v-model="matches"
                v-bind:matchdays="formData.matchdays" @change-matchday="changeMatchday" @save-matches="saveAll"
                v-bind:current-matchday-number="selectedMatchdayNumber"
                v-bind:timestamp-now="currentTimeStamp"/>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";

import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {useError} from '@/composables/useError.js';
import {useMessage} from '@/composables/useMessage.js';
import {saveMessage} from "@/util/errorMessages.js";

import TippModusDataService from "@/service/tipps/TippModusDataService.js";
import TippDataService from "@/service/tipps/TippDataService.js";
import TotoForm from "./TotoForm.vue";
import ResultForm from "./ResultForm.vue";
import PointForm from "./PointForm.vue";
import TippModus from "./TippModus.vue";
import TippConfigDataService from "@/service/tipps/TippConfigDataService.js";
import {formatDateTime} from "@/util/DateFromatter.js";
import {assignTotoTippsForSave, assignTotoTippsForLoad} from "@/util/TippUtil.js";

const umsInfoStore = useUmsInfoStore();
const {defaultCompetitionId, defaultCommMembId, defaultCompMembId, defaultCommunityId} = storeToRefs(umsInfoStore);

const {setMessage} = useMessage();
const {setError} = useError();

// --- Reaktive Zustände (State) ---
const germanDate = ref(null);
const currentTimeStamp= ref(null);
const nextFutureMatchdayNumber = ref(null);
const selectedMatchdayNumber = ref(null);
const isUpdate = ref(false);
const matches = ref([]);
const formData = ref(
    {
      matchdays: [],
      totalMatchdays: 34,
      currentMatchday: null,
      currentMatchdayId: null,

      loading: false,
      tippConfig: null,
      tippModus: null,
      tippModusId: ''
    }
)

const logSaves = (matches) => {
  console.log("logSaves");
  for (const item of matches) {
    console.log(JSON.stringify(item));
  }

}

const saveAll = async () => {
//  logSaves(matches.value);

  if (formData.value.tippModus.type === 'TotoTipp') {
    assignTotoTippsForSave(matches.value);
    //  logSaves(matches.value);

  }
  try {
    if (isUpdate.value) {
      await TippDataService.update(formData.value.currentMatchdayId, matches.value);
    } else {
      await TippDataService.create(matches.value);
    }
    await fetchMatchesForMatchday();
    setMessage("Tipps für Spieltag " + selectedMatchdayNumber.value + "  gespeichert");
  } catch (err) {
    console.error(err);
    setError(saveMessage(err));
  }
}

// --- API-Aufruf (Axios) ---
const fetchMatchdays = async () => {
  formData.value.loading = true;
  try {
    const matchdaysResponse = await MatchdayDataService.getMatchdaysByCompId(defaultCompetitionId.value);

    if (matchdaysResponse.status === 200) {
      formData.value.matchdays = matchdaysResponse.data;
      console.log("matchdays.size: ", formData.value.matchdays.length);
      if (formData.value.matchdays.length > 0) {
        formData.value.currentMatchday = formData.value.matchdays[0];
        formData.value.currentMatchdayId = formData.value.currentMatchday.id;
        formData.value.totalMatchdays = formData.value.matchdays.length;
        await fetchMatchesForMatchday();
        await retrieveTippModus();
      }
    }
  } catch (err) {
    console.error(err.message);
    setError(saveMessage(err));
  }
}


const retrieveTippModus = async () => {
  console.log("retrieveTippModus");
  formData.value.loading = true;

  try {
    const configResponse = await TippConfigDataService.findByMatchdayAndCompMemb(formData.value.currentMatchdayId, defaultCompMembId.value);
    if (configResponse.status === 200) {
      formData.value.tippConfig = configResponse.data;
      const response = await TippModusDataService.getOne(formData.value.tippConfig.tippModusId);
      if (response.status === 200) {
        formData.value.tippModus = response.data;
        console.log("modus::",JSON.stringify(formData.value.tippModus));
      }
    }
    formData.value.loading = false;
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const fetchMatchesForMatchday = async () => {
  console.log("fetchMatchesForMatchday");
  formData.value.loading = true;
  try {

    if (selectedMatchdayNumber.value === null) {
      await retrieveCurrentMatchday();
    }
    formData.value.currentMatchday = getMatchdayByNumber(selectedMatchdayNumber.value);
    formData.value.currentMatchdayId = formData.value.currentMatchday.id;
    const matchesResponse = await TippDataService.findTippRowsForTipper(formData.value.currentMatchdayId, defaultCommMembId.value);
    if (matchesResponse.status === 200) {
      matches.value = matchesResponse.data.tippRows;
      isUpdate.value = matchesResponse.data.update;
      await retrieveTippModus();
      formData.value.loading = false;
    }
    const myResponse= await TippDataService.findTippRowsForCommunity(formData.value.currentMatchdayId,defaultCommunityId.value);
    } catch (err) {
    console.error(err);
    setError(saveMessage(err));
  } finally {
    console.log("finally");
    if (formData.value.tippModus.type === 'TotoTipp') {
      assignTotoTippsForLoad(matches.value);
      //   logSaves(matches.value);

    }
  }
}

const retrieveCurrentMatchday = async () => {
  let timestampNow = Date.now();
  const currentDate = new Date(timestampNow);
  currentDate.setDate(29);
  germanDate.value = formatDateTime(currentDate);
  console.log("germanDate::", germanDate);
  currentTimeStamp.value = new Date(currentDate).getTime();
  const greaterMatchdays = formData.value.matchdays.filter(matchday => {
    console.log("matchdate::", matchday.startDate);
    let _timestamp = new Date(matchday.startDate).getTime();
    return _timestamp > currentTimeStamp;
  });
  if (greaterMatchdays.length > 0) {
    nextFutureMatchdayNumber.value = selectedMatchdayNumber.value = greaterMatchdays[0].spieltagNumber;
  } else {
    nextFutureMatchdayNumber.value = selectedMatchdayNumber.value = formData.value.matchdays[0].spieltagNumber;
  }
}

// --- Event-Handler ---
const changeMatchday = (newMatchday) => {
  if (newMatchday >= 1 && newMatchday <= formData.value.totalMatchdays) {
    selectedMatchdayNumber.value = newMatchday;
  }
};


const getMatchdayByNumber = (numberToFind) => {
  return formData.value.matchdays.find(matchday => matchday.spieltagNumber === numberToFind);
}

// --- Watcher & Lifecycles ---
// Sobald sich die aktuelle Seite ändert, werden die Daten neu geladen
watch(selectedMatchdayNumber, () => {
  console.log("watch:" + selectedMatchdayNumber.value);
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
