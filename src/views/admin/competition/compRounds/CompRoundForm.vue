<template>

  <div class="card mb-4 ">
    <div class="card-header .bg-secondary fs-5">
      {{ editing ? 'Runde ändern' : 'Runde hinzufügen' }}
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="name" class="form-label fw-bold">Name</label>
            <input type="text" class="form-control   w-auto border border-3 " id="name" v-model="form.name" required>
          </div>
          <div class="col-auto">
            <label for="roundNumber" class="form-label fw-bold">laufende Nummer</label>
            <input type="number" min="1" class="form-control   w-auto border border-3 " id="roundNumber"
                   v-model="form.roundNumber" required>
          </div>
          <div class="col-auto">
            <label for="teamsSize" class="form-label fw-bold">Zahl der Teams</label>
            <input type="number" min="1" class="form-control   w-auto border border-3 " id="teamsSize"
                   v-model="form.teamsSize" required>
          </div>
          <div class="col-auto">
            <label for="matchdaysSize" class="form-label fw-bold">Zahl der Spieltage</label>
            <input type="number" min="1" class="form-control   w-auto border border-3 " id="matchdaysSize"
                   v-model="form.matchdaysSize" required>
          </div>
          <div class="col-auto">
            <label for="firstMatchday" class="form-label fw-bold">Erster Spieltag</label>
            <input type="number" min="1" class="form-control   w-auto border border-3 " id="firstMatchday"
                   v-model="form.firstMatchday" required>
          </div>
        </div>
        <div class="row g-4 mb-3">

          <div class="col-auto" v-if="! editing">
          <div v-if="! editing">
            <label for="compId" class="form-label fw-bold">Wähle den Wettbewerb:</label>
            <!-- Use Bootstrap's form-select class for styling -->
            <select id="compId" class="form-select   w-auto border border-3 " v-model="sharedComp"
                    @change="handleCompChange">
              <option v-for="competition in competitions" :value="competition" :key="competition.id">
                {{ competition.name }}
              </option>
            </select>
          </div>
        </div>
          <div class="col-auto">
            <label for="hasGroups" class="form-label fw-bold">hat Gruppen</label>
            <div class="form-check">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="hasClubs"
                  v-model="form.hasGroups"
              />
            </div>
          </div>
        </div>
        <div class="mb-3  p-3 ">
        <button type="submit" class="btn btn-primary">
          Runde {{ editing ? 'ändern' : 'speichern' }}
        </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CompForm',

  emits: ['save-compRound'],
  props: {
    competitions: Array,
    currentCompRound: Object,
    selectedComp: Object
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        roundNumber: '',
        hasGroups: false,
        teamsSize:1,
        matchdaysSize:1,
        firstMatchday:1,
        compName: "",
        compId: null
      },

      sharedComp: this.selectedComp,
      editing: false
    };
  },
  watch: {
    currentCompRound: {
      handler(newCompRound) {
        if (newCompRound) {
          this.form = {...newCompRound};
          this.editing = true;
        } else {
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

      this.form.compId = this.sharedComp.id;
      this.form.compName = this.sharedComp.name;
      console.log("save form", JSON.stringify(this.form));
      this.$emit('save-compRound', {...this.form});
      this.resetForm();
    },
    resetForm() {
      this.form = {id: null, name: '', roundNumber: '', hasGroups: false, compId: null, compName: null, matchdaysSize: 1,teamsSize: 1, firstMatchday: 1};
    },
    handleCompChange(event) {
      console.log("handleCompChange: sharedComp", JSON.stringify(this.sharedComp));
      this.form.compId = this.sharedComp.id;
      this.form.compName = this.sharedComp.name;
      console.log("handleCompChange", JSON.stringify(this.form));

    },
  }
};
</script>
<style scoped>
</style>