<template>
  <div class="card">
    <div class="card-header fw-bold">
     Wettbewerbe der {{selected.name}}
    </div>
    <div class="mb-3  p-3 border rounded">
      <div>
        <label for="famId" class="form-label fw-bold">Sport Event auswählen:</label>
        <!-- Use Bootstrap's form-select class for styling -->
        <form>
          <select id="famId" class="form-select w-auto" v-model="selected" @change="handleFamilyChange">
            <option v-for="family in families" :value="family" :key="family.id">
              {{ family.name }}
            </option>
          </select>
        </form>
      </div>
    </div>
    <div class="card-body">
      <button class="btn btn-warning btn-sm me-2" @click="$emit('create-competition',{
              isVisible:true
            })">Neuen Wettbewerb anlegen
      </button>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Beschreibung</th>
          <th>Punkte für Sieg</th>
          <th>Punkte für Remis</th>
          <th>Sport Event</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(competition) in competitions" :key="competition.id">
          <td>{{ competition.name }}</td>
          <td>{{ competition.description.substring(0,20) }}</td>
          <td>{{ competition.winMultiplicator }}</td>
          <td>{{ competition.remisMultiplicator }}</td>
          <td>{{ competition.familyName }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="$emit('edit-competition',{
              competition: competition,
              isVisible:true
            })">Ändern
            </button>
            <button class="btn btn-danger btn-sm" @click="$emit('delete-competition', competition)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompList',
  emits: ['delete-competition', 'edit-competition',"delete-competition",'select-family'],
  props: {
    competitions: {
      type: Array,
      required: true
    },
    families: {
      type: Array,
      required: true
    },
    selectedFamily: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        familyId: '',
        familyName: '',
      },
      selected: this.selectedFamily,

    }
  },
  methods: {

    handleFamilyChange(event) {
      this.form.familyId = this.selected.id;
      this.form.familyName = this.selected.name;

      this.$emit('select-family', {...this.form});
    }
  }
};
</script>
<style scoped>
</style>