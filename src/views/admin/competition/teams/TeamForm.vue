<template>

  <div class="card mb-4">
    <div class="card-header .bg-secondary fs-5">
      {{ editing ? 'Team ändern' : 'Team hinzufügen' }}
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3  p-3 border rounded">
          <label for="name" class="form-label  fw-bold">Name</label>
          <input type="text" class="form-control" id="name" v-model="form.name" required>
        </div>
        <div class="mb-3  p-3 border rounded">
          <label for="acronym" class="form-label  fw-bold">Kürzel</label>
          <input type="text" class="form-control" id="acronym" v-model="form.acronym" required>
        </div>
        <div class="mb-3 p-3 border rounded">
          <label for="isClub" class="form-label  fw-bold">ist Club</label>
          <div class="form-check">
            <input
                class="form-check-input"
                type="checkbox"
                id="isClub"
                v-model="form.hasClub"
            />
          </div>
        </div>
        <button type="submit" class="btn btn-primary">
         Team {{ editing ? 'ändern' : 'speichern' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>


export default {
  name: 'TeamForm',

  emits: ['save-team'],
  props: {
    currentTeam: Object
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        acronym: '',
        hasClub: true

      },
      editing: false,

    };
  },
  watch: {
    currentTeam: {
      handler(newTeam) {
        if (newTeam) {
          console.log("new team", JSON.stringify(newTeam));
          this.form = {...newTeam};
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

        this.$emit('save-team', {...this.form});
        this.resetForm();

    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        acronym: '',
        isClub: false
      };

    },
  }
};
</script>
<style scoped>
</style>>