<template>
  <div class="panel panel-default">TippModus: {{ formData.tippModusType }}</div>
  <TotoForm v-if="! formData.tippModusType==='TotoTipp' && !formData.loading" v-model="formData.matches"
            v-bind:matchdays="formData.matchdays" @change-matchday="changeMatchday" @save-matches="saveAll"
            v-bind:current-matchday-number="currentMatchdayNumber"/>
  <PointForm v-if=" formData.tippModusType==='PointTipp' && !formData.loading" v-model="formData.matches"
             v-bind:matchdays="formData.matchdays" @change-matchday="changeMatchday" @save-matches="saveAll"
             v-bind:current-matchday-number="currentMatchdayNumber"/>
  <ResultForm v-if=" formData.tippModusType==='ResultTipp' && !formData.loading" v-model="formData.matches"
              v-bind:matchdays="formData.matchdays" @change-matchday="changeMatchday" @save-matches="saveAll"
              v-bind:current-matchday-number="currentMatchdayNumber"/>

</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import axios from 'axios';
import MatchdayDataService from "@/service/competition/MatchdayDataService.js";

import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

const umsInfoStore = useUmsInfoStore();
const {defaultCompetitionId, defaultCommunityId, defaultCommMembId} = storeToRefs(umsInfoStore);
import {useError} from '@/composables/useError.js';
import {useMessage} from '@/composables/useMessage.js';
import {saveMessage} from "@/util/errorMessages.js";

import {formatDateTime, formatGermanDate} from "@/util/DateFromatter.js";

import TippModusDataService from "@/service/tipps/TippModusDataService.js";
import TippDataService from "@/service/tipps/TippDataService.js";
import TotoForm from "./TotoForm.vue";
import ResultForm from "./ResultForm.vue";
import PointForm from "./PointForm.vue";

const {setMessage} = useMessage();
const {setError} = useError();

// --- Reaktive Zustände (State) ---
const currentMatchdayNumber = ref(1);
const formData = ref(
    {
      matchdays: [],
      totalMatchdays: 34,
      currentMatchday: null,
      currentMatchdayId: 0,
      matches: [],
      loading: false,
      tippModusType: ''
    }
)
const saveAll = async () => {
  console.log("saveAll");
  try {

    await TippDataService.create(formData.value.matches);
    await fetchMatchesForMatchday();
    setMessage("Tpps für  " + currentMatchdayNumber.value + "  gespiechert");
  } catch (err) {
    console.error(err);
    setError(saveMessage(err));
  }
}

const retrieveCurrentMatchday = () => {
  let finished;
  let timestampNow = Date.now();

  console.log("timestampNow::", timestampNow);
  const currentDate = new Date(timestampNow);
  const formattedDate = formatDateTime(currentDate);
  let timeStampFuture = currentDate.getTime();
  const greaterMatchdays = formData.value.matchdays.filter(matchday => {console.log("ori: ::", matchday.startDate);
    let _timestamp = new Date(matchday.startDate).getTime();
    const germanDate = formatDateTime(_timestamp);
    console.log(` ${matchday.spieltagNumber}: spieltag timestamp: ${_timestamp}, current timestamp: ${timeStampFuture}.`);
    console.log(`${matchday.spieltagNumber}: spieltag date: ${germanDate}, current date: ${formattedDate}.`);
    console.log(_timestamp > timeStampFuture);
    return _timestamp > timeStampFuture;
  });
  console.log("greater matchdays::", greaterMatchdays.length);
  if (greaterMatchdays.length > 0) {
    currentMatchdayNumber.value = greaterMatchdays[0].spieltagNumber;

  } else {
    currentMatchdayNumber.value =formData.value.matchdays[1].spieltagNumber;
  }


    finished = true;
    return finished;
  }

// --- API-Aufruf (Axios) ---
  const fetchMatchdays = async () => {
    formData.value.loading = true;
    try {
      const matchdaysResponse = await MatchdayDataService.getMatchdaysByCompId(defaultCompetitionId.value);
      console.log("...loaded matchdays", matchdaysResponse.status);
      if (matchdaysResponse.status === 200) {
        console.log("status:", matchdaysResponse.status);
        formData.value.matchdays = matchdaysResponse.data;
        if (formData.value.matchdays.length > 0) {
          formData.value.currentMatchday = formData.value.matchdays[0];
          console.log("first date::", formData.value.currentMatchday.startDate);
          formData.value.currentMatchdayId = formData.value.currentMatchday.id;
          currentMatchdayNumber.value = formData.value.currentMatchday.spieltagNumber;
          formData.value.totalMatchdays = formData.value.matchdays.length;
          await fetchMatchesForMatchday();

        }
      }
    } catch (err) {
      console.error(err.message);
      setError(saveMessage(err));
    }
  }
  const retrieveTippModi = async () => {
    formData.value.loading = true;

    try {
      const response = await TippModusDataService.getModiForCommunity(defaultCommunityId.value);
      if (response.status === 200) {
        formData.value.tippModi = response.data;
        if (formData.value.tippModi.length > 0) {
          formData.value.tippModusType = formData.value.tippModi[0].type;
          console.log(formData.value.tippModusType);
        }
      }
    } catch (e) {
      console.error(e);
      setError(saveMessage(e));
    }
  }

  const fetchMatchesForMatchday = async () => {
    console.log("fetchMatchesForMatchday");
    formData.value.loading = true;
    try {
      console.log("retrieveCurrentMatchday.....");
      if (retrieveCurrentMatchday()) {
        console.log("....retrieveCurrentMatchday");
        formData.value.currentMatchday = getMatchdayByNumber(currentMatchdayNumber.value);
        formData.value.currentMatchdayId = formData.value.currentMatchday.id;
        const matchesResponse = await TippDataService.findTippRowsForTipper(formData.value.currentMatchdayId, defaultCommMembId.value);
        formData.value.matches = matchesResponse.data;
        formData.value.matches.forEach((match, index) => {
          match.commMembId = defaultCommMembId.value;
        });
        setMessage("Spieltag  " + currentMatchdayNumber.value + "  geladen");
      }
    } catch
        (err) {
      console.error(err);
      setError(saveMessage(err));
    } finally {
      formData.value.loading = false;

    }
  }
// --- Event-Handler ---
  const changeMatchday = (newMatchday) => {
    console.log("changeMatchday", newMatchday);
    if (newMatchday >= 1 && newMatchday <= formData.value.totalMatchdays) {
      console.log("changeMatchday", newMatchday);
      currentMatchdayNumber.value = newMatchday;
    }
  };


  const getMatchdayByNumber = (numberToFind) => {
    console.log("selectedMatchday by number::", JSON.stringify(numberToFind));
    const myDay = formData.value.matchdays.find(matchday => matchday.spieltagNumber === numberToFind);
    console.log("selectedMatchday::", JSON.stringify(myDay));
    return myDay;
  }

// --- Watcher & Lifecycles ---
// Sobald sich die aktuelle Seite ändert, werden die Daten neu geladen
  watch(currentMatchdayNumber, () => {
    console.log("watch:" + currentMatchdayNumber.value);
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
