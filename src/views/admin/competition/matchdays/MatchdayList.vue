<template>
  <div class="card">
    <div class="card-header fw-bold">
      Spieltage der {{ selected.name }} ({{ selected.compName }})
    </div>
    <div class="mb-3  p-3 border rounded">
      <div>
        <label for="roundId" class="form-label fw-bold">Runde auswählen </label>
        <!-- Use Bootstrap's form-select class for styling -->
        <form>
          <select id="roundId" class="form-select w-auto" v-model="selected" @change="handleRoundChange">
            <option v-for="round in rounds" :value="round" :key="round.id">
              {{ round.name }}
            </option>
          </select>
        </form>
      </div>
    </div>
    <div class="card-body">
      <div class="row mb-3  p-1">
        <div class="col-auto">
          <button class="btn btn-warning btn-sm me-2" @click="$emit('create-matchday',{
              isVisible:true
            })">Einen Spieltag anlegen
          </button>
        </div>
        <div class="col-auto">
          <button class="btn btn-warning btn-sm me-2" @click="$emit('create-matchdays',{
              isVisible:true,
              selectedRound:selected,
            })">Spieltage anlegen
          </button>
        </div>
      </div>

      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Spieltag</th>
          <th>Datum</th>
          <th>Runde</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(matchday) in matchdays" :key="matchday.id">
          <td>{{ matchday.spieltagNumber }}</td>
          <td>{{ convertDate(matchday.startDate) }}</td>
          <td>{{ matchday.compRoundName }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="$emit('edit-matchday',{
              matchday:matchday,
              isVisible:true
            })">Ändern
            </button>
            <button class="btn btn-danger btn-sm" @click="$emit('delete-matchday', matchday)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {formatDateTime, formatGermanDate} from "@/util/DateFromatter.js";

export default {
  name: 'MatchdayList',
  emits: ['select-round', 'create-matchday', 'delete-matchday', 'edit-matchday'],
  props: {
    matchdays: {
      type: Array,
      required: true
    },
    rounds: {
      type: Array,
      required: true
    },
    selectedRound: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        roundId: '',
        roundName: '',
      },
      selected: this.selectedRound,

    }

  },
  methods: {
    convertDate(matchdayDate) {
      return formatGermanDate(matchdayDate);
    },

    handleRoundChange(event) {
      this.form.roundId = this.selected.id;
      this.form.roundName = this.selected.name;

      this.$emit('select-round', {...this.form});
    }
  },
};
</script>
<style scoped>
</style>