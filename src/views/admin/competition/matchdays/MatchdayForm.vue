<template>

  <div class="card mb-4">
    <div class="card-header .bg-secondary fs-5">
      {{ editing ? 'Spieltag ändern' : ' Spieltag hinzufügen' }} für {{sharedRound.name}}
    </div>

    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
          <label for="matchdayNumber" class="form-label fw-bold">Spieltag</label>
          <input type="number" min="1" class="form-control  w-auto border border-3 " id="matchdayNumber"
                 v-model="form.spieltagNumber" required>
        </div>
          <div class="col-auto">
          <label for="theDate" class="form-label  fw-bold">Datum</label>
          <input type="text" class="form-control  w-auto border border-3 " id="theDate"
                 v-model="form.startDate" @change="validateDate" required>
          <p v-if="dateError" style="color: red;">
            {{ dateError }}
          </p>
        </div>
          <div class="col-auto" v-if="! editing">
            <label for="roundId" class="form-label  fw-bold">Wähle die Runde:</label>
            <!-- Use Bootstrap's form-select class for styling -->
            <select id="roundId" class="form-select  w-auto border border-3 " v-model="sharedRound"
                    @change="handleRoundChange" required>
              <option v-for="round in rounds" :value="round" :key="round.id">
                {{ round.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="mb-3  p-3 ">
        <button :disabled="!isValidDate" type="submit" class="btn btn-primary">
          Spieltag {{ editing ? 'ändern' : 'speichern' }}
        </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import {formatDateTime, validateDateTime} from "@/util/DateFromatter.js";


export default {
  name: 'MatchdayForm',

  emits: ['save-matchday'],
  props: {
    rounds: Array,
    selectedRound: Object,
    currentMatchday: Object
  },
  data() {
    return {
      form: {
        id: null,
        spieltagNumber: '',
        startDate: formatDateTime(new Date()),
        compRoundName: "",
        compRoundId: null
      },

      sharedRound: this.selectedRound,
      editing: false,
      dateError: null,
      isValidDate: false
    };
  },
  watch: {
    currentMatchday: {
      handler(newMatchday) {
        if (newMatchday) {
          console.log("new matchday", newMatchday);
          this.form = {...newMatchday};
          this.editing = true;
          this.isValidDate = true;
        } else {
          console.log("resetForm");
          this.resetForm();
          this.editing = false;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleSubmit() {
      console.log("handleSubmit");
      this.form.compRoundId = this.sharedRound.id;
      this.form.compRoundName = this.sharedRound.name;
      if (validateDateTime(this.form.startDate.trim()) === true) {

        this.$emit('save-matchday', {...this.form});
        this.resetForm();
      } else {
        console.log(validateDateTime("error:", this.form.startDate));
      }
    },
    resetForm() {
      this.form = {
        id: null,
        spieltagNumber: '',
        startDate: formatDateTime(new Date()),
        compRoundId: null,
        compRoundName: null,
      };
      this.dateError = null;
      this.isValidDate = true;
    },
    handleRoundChange() {
      console.log("sharedRound", JSON.stringify(this.sharedRound));
      this.form.compRoundId = this.sharedRound.id;
      this.form.compRoundName = this.sharedRound.name;
    },
    validateDate() {
      // Clear previous errors/status
      this.dateError = null;
      this.isValidDate = false;

      if (validateDateTime(this.form.startDate) === false) {
        this.dateError = 'Datum muss dem Format dd-MM-yyyy HH:mm entsprechen.';
        this.isValidDate = false;

      } else {
        this.dateError = null;
        this.isValidDate = true;
      }
    }
  }
};
</script>
<style scoped>
</style>