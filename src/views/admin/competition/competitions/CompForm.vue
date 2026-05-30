<template>

  <div class="card mb-4 ">
    <div class="card-header  fs-5 ">
      {{ editing ? 'Wettbewerb ändern' : 'Wettbewerb hinzufügen' }}
    </div>
    <div class="card-body ">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="name" class="form-label  fw-bold">Name</label>
            <input type="text" class="form-control  w-auto border border-3 " id="name" v-model="form.name"
                   minlength="10" maxlength="30">
          </div>
          <div class="col-auto">
            <label for="description" class="form-label  fw-bold">Beschreibung</label>
            <input type="text" class="form-control  w-auto border border-3 " id="description" v-model="form.description"
                   minlength="10">
          </div>
        </div>
        <div class="row g-4">
          <div class="col-auto">
            <label for="winMultiplicator" class="form-label fw-bold">Punkte für Sieg</label>
            <input type="number" min="0" class="form-control  w-auto border border-3 " id="winMultiplicator"
                   v-model="form.winMultiplicator"
                   maxlength="1">
          </div>

          <div class="col-auto">
            <label for="remisMultiplicator" class="form-label  fw-bold">Punkte für Remis</label>
            <input type="number" min="0" class="form-control  w-auto border border-3 " id="remisMultiplicator"
                   v-model="form.remisMultiplicator" required
                   maxlength="1">
          </div>
          <div class="col-auto">
            <div v-if="! editing">
              <label for="familyId" class="form-label  fw-bold">Wähle den Sport-Event:</label>
              <!-- Use Bootstrap's form-select class for styling -->
              <select id="familyId" class="form-select  w-auto border border-3 " v-model="sharedFamily"
                      @change="handleFamilyChange" required>
                <option v-for="family in families" :value="family" :key="family.id">
                  {{ family.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="mb-3  p-3 ">
            <button type="submit" class="btn btn-primary">
              Wettbewerb {{ editing ? 'ändern' : 'speichern' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>


export default {
  name: 'CompForm',

  emits: ['save-competition'],
  props: {
    families: Array,
    currentCompetition: Object,
    selectedFamily: Object
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        description: '',
        winMultiplicator: '3',
        remisMultiplicator: '1',
        familyName: "",
        familyId: null
      },

      sharedFamily: this.selectedFamily, // The data property shared by both forms
      editing: false
    };
  },
  watch: {
    currentCompetition: {
      handler(newCompetition) {
        if (newCompetition) {
          console.log("new competition", JSON.stringify(newCompetition));
          this.form = {...newCompetition};
          this.editing = true;
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
      this.form.familyId = this.sharedFamily.id;
      this.form.familyName = this.sharedFamily.name;
      this.$emit('save-competition', {...this.form});
      this.resetForm();
    },
    resetForm() {
      this.form = {id: null, name: '', description: '', familyId: null};
    },
    handleFamilyChange(event) {
      this.form.familyId = this.sharedFamily.id;
      this.form.familyName = this.sharedFamily.name;


    },
  }
};
</script>
<style scoped>
</style>
