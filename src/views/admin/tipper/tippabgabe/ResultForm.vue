<template>
  <div class="datatable-container">

    <div class="datatable-container">
      <!-- Status-Anzeigen -->

      <!-- Die Datentabelle -->
      <table class="custom-table">
        <thead>
        <tr>
          <th>Anpfiff</th>
          <th>Heim</th>
          <th>Gast</th>
          <th>Ergebnis</th>
          <th>HeimTipp</th>
          <th>GastTipp</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(match) in matches" :key="match.id">
          <td>{{ match.anpfiffdate }}</td>
          <td>{{ match.heimName }}</td>
          <td>{{ match.gastName }}</td>
          <td>{{ match.heimTore }}:{{ match.gastTore }}</td>
          <td>
            <input type="number" class="small-input form-control  border border-3 " id="totalPoints"
                   :name="match.id"
                   v-model="match.heimTipp" min="0" placeholder="0">
          </td>
          <td><input type="number" class="small-input  form-control   border border-3 " id="totalPoints"
                     :name="match.id"
                     v-model="match.gastTipp" min="0" placeholder="0">
          </td>
        </tr>
        <tr v-if="matches.length === 0">
          <td colspan="4" class="no-data">Keine Einträge gefunden.</td>
        </tr>
        <button type="button" @click="saveMatches">Save</button>
        </tbody>
      </table>

      <!-- Paginator / Steuerungselemente -->
      <div class="paginator-controls">


        <div class="pagination-buttons">
          <button
              :disabled="currentMatchdayNumber === 1 "
              @click="changeMatchday(1)"
          >
            &laquo; Erste
          </button>
          <button
              :disabled="currentMatchdayNumber === 1 "
              @click="changeMatchday(currentMatchdayNumber - 1)"
          >
            &lsaquo; Zurück
          </button>

          <span class="page-info">
          Spieltag <strong>{{ currentMatchdayNumber }}</strong> von <strong>{{
              matchdays.length
            }}</strong>
          ({{ matchdays.length }} Einträge gesamt)
        </span>

          <button
              :disabled="currentMatchdayNumber === matchdays.length"
              @click="changeMatchday(currentMatchdayNumber + 1)"
          >
            Weiter &rsaquo;
          </button>
          <button
              :disabled="currentMatchdayNumber === matchdays.length  "
              @click="changeMatchday(matchdays.length)"
          >
            Letzte &raquo;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {defineEmits, defineProps, ref, toRef, defineModel} from 'vue';
import {saveMessage} from "@/util/errorMessages.js";
import TippModusDataService from "../../../../service/tipps/TippModusDataService.js";
// Define props using macro (no import needed)
// Automatically handles prop and update emit
const matches = defineModel({type: Array, required: true})

const emit = defineEmits(['save-matches', 'change-matchday']);
const props = defineProps({
  matchdays: {
    type: Array,
    required: true,
    default: () => []
  },

  currentMatchdayNumber: {
    type: Number,
    required: true
  }
});
const matchdays = toRef(props, 'matchdays');
const currentMatchdayNumber = toRef(props, 'currentMatchdayNumber');

const editing = ref(false);
// Initialize with a shallow copy


const saveAll = () => {
  console.log("saveAll");
}
const changeMatchday = (newMatchday) => {
  console.log("changeMatchday", newMatchday);
  if (newMatchday >= 1 && newMatchday <= matchdays.value.length) {
    console.log("changeMatchday", newMatchday);
    currentMatchdayNumber.value = newMatchday;
    emit('change-matchday', newMatchday);
  }
};
const saveMatches = () => {
  console.log("saveMatches");
  emit("save-matches");
}
</script>

<style scoped>
.small-input {
  width: 100px;

}
.datatable-container {
  font-family: sans-serif;
  margin: 20px auto;
  max-width:750px;
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