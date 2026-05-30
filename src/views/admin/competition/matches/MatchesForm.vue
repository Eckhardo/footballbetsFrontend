
<template>

  <div class="card mb-4">
    <div class="card-header .bg-secondary fs-5">
    Spiele anlegen  für {{selectedRound.name}}
    </div>

    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
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
          <button  type="submit" class="btn btn-primary">
            Spiele speichern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "MatchesForm",

  emits: ['save-matches'],
  props: {
    rounds: Array,
    selectedRound: Object,
    compTeams: Array
  },
  data() {
    return{
      form:{
        compRoundId: null,
        heimTeamId: null,
        gastTeamId: null,
      },
      editing:false,
      sharedRound: this.selectedRound,
    }

  },
  methods: {
    handleSubmit() {
        console.log("handleSubmit:: {}", JSON.stringify(this.form));
        this.$emit('save-matches', {...this.form});
        this.resetForm();

    },
    resetForm() {
      this.form = {
        compRoundId: null,
        heimTeamId: null,
        gastTeamId: null,

      };
    },
    handleHeimTeamChange(event) {
      console.log("handleHeimTeamChange", event.target.value);
      this.form.heimTeamId = event.target.value;

    },
    handleGastTeamChange(event) {
      console.log("handleGastTeamChange", event.target.value);
      this.form.gastTeamId = event.target.value;

    },
    handleRoundChange() {
      console.log("sharedRound", JSON.stringify(this.sharedRound));
      this.form.compRoundId = this.sharedRound.id;

    },
  }
}
</script>

<style scoped>

</style>