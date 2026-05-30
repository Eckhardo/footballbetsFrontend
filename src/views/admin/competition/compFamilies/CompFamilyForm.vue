<template>


  <div class="card mb-4">
    <div class="card-header .bg-secondary  fs-5">
      {{ editing ? 'Sport Event ändern' : 'Sport Event hinzufügen' }}
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
          <label for="name" class="form-label  fw-bold">Name</label>
          <input type="text" class="form-control  w-auto border border-3 " id="name" v-model.trim="form.name" required>
        </div>
          <div class="col-auto">
          <label for="description" class="form-label  fw-bold">Beschreibung</label>
          <input type="text" class="form-control  w-auto border border-3 " id="description" v-model.trim="form.description" min="10">
        </div>
        </div>
        <div class="row g-4">
          <div class="col-auto">
          <label for="hasClubs" class="form-label  fw-bold ">hat Clubs</label>
          <div class="form-check">
            <input
                class="form-check-input"
                type="checkbox"
                checked
                id="hasClubs"
                v-model="form.hasClubs"
            />
          </div>
        </div>


          <div class="col-auto">
          <label for="hasLigaModus" class="form-label  fw-bold">spielt im Liga Modus</label>
          <div class="form-check">
            <input
                class="form-check-input"
                type="checkbox"
                checked
                id="hasLigaModus"
                v-model="form.hasLigaModus"
            />
          </div>
        </div>
          <div class="col-auto">
          <label for="roundId" class="form-label  fw-bold">Wähle das Land:</label>
          <!-- Use Bootstrap's form-select class for styling -->
          <select id="roundId" class="form-select  w-auto border border-3 "
                  @change="handleCountryChange" required >
            <option v-for="country in countries" :value="country" :key="country">
              {{ country }}
            </option>
          </select>
        </div>
        </div>
        <div class="mb-3  p-3 ">
        <button type="submit" class="btn btn-primary">
         Sport Event {{ editing ? 'ändern' : 'speichern' }}
        </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CompFamilyForm',
  emits: ['save-compFamily'],
  props: {
    currentCompFamily: Object,
    countries: Array,
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        description: '',
        hasClubs: false,
        country:null,
        hasLigaModus: false
      },

      editing: false
    };
  },
  watch: {
    currentCompFamily: {
      handler(newCompFamily) {
        if (newCompFamily) {
          console.log("new family", JSON.stringify(newCompFamily));
          this.form = {...newCompFamily};
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

      this.$emit('save-compFamily', {...this.form});
      this.resetForm();
    },
    handleCountryChange(event) {
      console.log("country", JSON.stringify(event.target.value));
      this.form.country = event.target.value;

    },
    resetForm() {
      this.form = {id: null, name: '', description: '',hasClubs: false, hasLigaModus: false};
    },
  }
};
</script>
<style scoped>
</style>