<template>

  <div class="card mb-4">
    <div class="card-header .bg-secondary fs-5">
      Spieltage hinzufügen für {{sharedRound.name}}
    </div>


    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-1">
          <div class="col-auto">
            <label for="spieltagStart" class="form-label fw-bold">Spieltag Nummer Start</label>
            <input type="number" min="1" class="form-control  w-auto border border-3 " id="spieltagStart"
                   v-model="form.firstMatchdayNumber"
                   required disabled>
          </div>
          <div class="col-auto">
          <label for="spieltagEnd" class="form-label fw-bold">Spieltag Nummer Ende</label>
          <input type="number" min="2" class="form-control  w-auto border border-3 " id="spieltagEnd"
                 v-model="form.lastMatchdayNumber"
                 required disabled>
          </div>
          <div class="col-auto">
            <label for="roundId" class="form-label  fw-bold">Wähle die Runde:</label>
            <!-- Use Bootstrap's form-select class for styling -->
            <select id="roundId" class="form-select  w-auto border border-3 " v-model="sharedRound"
                    @change="handleRoundChange" required>
              <option v-for="round in rounds" :value="round" :key="round.id">
                {{ round.name }}
              </option>
            </select>
          </div>
          <p v-if="!isFieldAValid" style="color: red;">
            {{ errorMessage }}
          </p>
        </div>
        <div class="mb-3  p-3 ">
        <button :disabled="!isFieldAValid" type="submit" class="btn btn-primary">
          Spieltage speichern
        </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>

export default {
  name: "MatchdaysForm",

  emits: ['save-matchdays'],
  props: {
    rounds: Array,
    selectedRound: Object

  },
  data() {
    return {
      form: {
        id: null,
        firstMatchdayNumber: this.selectedRound.firstMatchday,
        lastMatchdayNumber: this.selectedRound.firstMatchday+ this.selectedRound.matchdaysSize-1,
        compRoundName: "",
        compRoundId: null
      },

      sharedRound: this.selectedRound, // The data property shared by both forms
      editing: false,
      dateError: null,
      isValidDate: false
    };
  },
  computed: {
    isFieldAValid() {
      console.log("validate");
      // Logic: Field A must be strictly smaller than Field B
      return this.form.firstMatchdayNumber < this.form.lastMatchdayNumber;
    },
    errorMessage() {
      return this.isFieldAValid ? '' : 'Spieltag Start must be smaller than Spieltag End';
    }
  },
  methods: {
    handleSubmit() {
      console.log("handleSubmit");
      this.form.compRoundId = this.sharedRound.id;
      this.form.compRoundName = this.sharedRound.name;
      this.$emit('save-matchdays', {...this.form});

    },
    resetForm() {
      this.form = {
        id: null,
        firstMatchdayNumber: 1,
        lastMatchdayNumber: 34,
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
      this.form.firstMatchdayNumber= this.sharedRound.firstMatchday;
      this.form.lastMatchdayNumber= this.sharedRound.firstMatchday+ this.sharedRound.matchdaysSize-1;
    }
  }
}
</script>

<style scoped>

</style>