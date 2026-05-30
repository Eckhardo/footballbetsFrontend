<template>

  <div class="card mb-4">
    <div class="card-header .bg-secondary fs-5">
      {{ editing ? 'Spiel ändern' : 'Spiel hinzufügen' }}
    </div>
    <div class="card-body ">
      <form @submit.prevent="handleSubmit">

        <div class="row g-4 mb-3">

          <div class="col-auto">
            <label for="theDate" class="form-label fw-bold">Anpfiff Datum</label>
            <input type="text" class="form-control  w-auto border border-3 " id="theDate"
                   v-model="form.anpfiffdate" @change="validateDate" required>
            <p v-if="dateError" style="color: red;">
              {{ dateError }}
            </p>
          </div>

          <div class="col-auto">
            <label for="spieltag" class="form-label fw-bold">Spieltag</label>
            <input type="number" min="0" class="form-select w-auto border border-3 " id="spieltag"
                   v-model="sharedMatchday.spieltagNumber"
                   disabled>
          </div>
        </div>
        <div class="row g-4">

          <div class="col-auto">
            <label for="number" class="form-label fw-bold">Spiel Nummer</label>
            <input type="number" min="0" class="form-control border border-3 " id="number" v-model="form.spielNumber"
                   :disabled="editing">
          </div>
          <div class="col-auto">
            <label for="heimTeam" class="form-label fw-bold">Heimteam </label>
            <select id="heimTeam" class="form-select w-auto border border-3 " v-model="form.heimTeamId"
                    @change="handleHeimTeamChange">
              <option v-for="compTeam in compTeams" :value="compTeam.teamId" :key="compTeam.heimTeamId">
                {{ compTeam.teamAcronym }}
              </option>
            </select>
          </div>

          <div class="col-auto">
            <label for="gastTeam" class="form-label fw-bold">Gastteam </label>
            <select id="gastTeam" class="form-select w-auto border border-3 " v-model="form.gastTeamId"
                    @change="handleGastTeamChange">
              <option v-for="compTeam in compTeams" :value="compTeam.teamId" :key="compTeam.gastTeamId">
                {{ compTeam.teamAcronym }}
              </option>
            </select>
          </div>

          <div class="col-auto">
            <label for="heimTore" class="form-label fw-bold">Heimtore</label>
            <input type="number" min="0" class="form-control border border-3 " id="heimTore" v-model="form.heimTore"
                   required>
          </div>
          <div class="col-auto">
            <label for="gastTore" class="form-label fw-bold">Auswärtstore</label>
            <input type="number" min="0" class="form-control border border-3 " id="gastTore" v-model="form.gastTore"
                   required>
          </div>
          <div class="col-auto">
            <label for="stattgefunden" class="form-label fw-bold">Stattgefunden</label>
            <div class="form-check ">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="stattgefunden"
                  v-model="form.stattgefunden"
              />
            </div>
          </div>
        </div>
        <div class="mb-3  p-3 ">
          <button type="submit" class="btn btn-primary">
            Spiel {{ editing ? 'ändern' : 'speichern' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import {formatDateTime, validateDateTime} from "@/util/DateFromatter.js";


export default {
  name: 'MatchForm',

  emits: ['save-match'],
  props: {
    matchdays: Array,
    selectedMatchday: Object,
    compTeams: Array,
    currentMatch: Object
  },
  data() {
    return {
      form: {
        id: null,
        spielNumber: '',
        anpfiffdate: formatDateTime(new Date()),
        spieltagNumber: null,
        spieltagId:null,
        heimTore: null,
        gastTore: null,
        stattgefunden: false,
        heimTeamId: null,
        gastTeamId: null,
        heimTeamAcronym: "",
        gastTeamAcronym: "",
      },
      sharedMatchday:this.selectedMatchday,

      editing: false,
      dateError: null,
      isValidDate: false
    };
  },
  watch: {
    currentMatch: {
      handler(newMatch) {
        if (newMatch) {
          console.log("new match", JSON.stringify(newMatch));
          this.form = {...newMatch};
          this.editing = true;
          this.isValidDate = true;
        } else {
          console.log("resetForm");
          this.resetForm();
          this.form.spieltagNumber=this.selectedMatchday.spieltagNumber;
          this.form.spieltagId=this.selectedMatchday.spieltagId;
          this.editing = false;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleSubmit() {

      if (validateDateTime(this.form.anpfiffdate.trim()) === true) {
        this.form.spieltagId = this.selectedMatchday.id;
        this.form.spieltagNumber = this.selectedMatchday.spieltagNumber;
        console.log("handleSubmit:: {}",JSON.stringify(this.form));
        this.$emit('save-match', {...this.form});
        this.resetForm();
      } else {
        console.log(validateDateTime("error:", this.form.anpfiffdate));
      }
    },
    resetForm() {
      this.form = {
        id: null,
        spielNumber: '',
        spieltagNumber: null,
        spieltagId:null,
        anpfiffdate: formatDateTime(new Date()),
        heimTore: null,
        gastTore: null,
        stattgefunden: false,
        heimTeamId: null,
        gastTeamId: null,
        heimTeamAcronym: "",
        GastTeamAcronym: "",
      };
      this.dateError = null;
      this.isValidDate = true;
    },
    handleHeimTeamChange(event) {
      console.log("handleHeimTeamChange", event.target.value);
      this.form.heimTeamId = event.target.value;

    },
    handleGastTeamChange(event) {
      console.log("handleGastTeamChange", event.target.value);
      this.form.gastTeamId = event.target.value;

    },
    validateDate() {
      // Clear previous errors/status
      this.dateError = null;
      this.isValidDate = false;

      if (validateDateTime(this.form.anpfiffdate) === false) {
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