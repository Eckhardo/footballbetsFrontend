<template>
  <div class="card">
    <div class="card-header fw-bold">
      Runden des Wettbewerbs {{ selected.name }}
    </div>
    <div class="mb-3  p-3 border rounded">
      <div>
        <label for="compId" class="form-label fw-bold">Wähle den Wettbewerb für {{ selected.familyName }}:</label>
        <!-- Use Bootstrap's form-select class for styling -->
        <form>
          <select id="compId" class="form-select w-auto" v-model="selected" @change="handleCompChange">
            <option v-for="competition in comps" :value="competition" :key="competition.id">
              {{ competition.name }}
            </option>
          </select>
        </form>
      </div>
    </div>
    <div class="card-body">
      <button class="btn btn-warning btn-sm me-2" @click="$emit('create-compRound',{
              isVisible:true
            })">Neue Runde anlegen
      </button>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>laufende Nummer</th>
          <th>hat Gruppen</th>
          <th>Wettbewerb</th>
          <th># Teams</th>
          <th># Spieltage</th>
          <th>Erster Spieltag</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(compRound) in compRounds" :key="compRound.id">
          <td>{{ compRound.name }}</td>
          <td>{{ compRound.roundNumber }}</td>
          <td>
            <div class="form-check">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="hasGroups"
                  v-model="compRound.hasGroups"
                  disabled
              />
            </div>
          </td>
          <td>{{ compRound.compName }}</td>
          <td>{{ compRound.teamsSize }}</td>
          <td>{{ compRound.matchdaysSize }}</td>
          <td>{{ compRound.firstMatchday }}</td>
          <td>
            <button class="btn btn-warning  btn-sm me-2" @click="$emit('edit-compRound',{
              compRound:compRound,
              isVisible:true
            })">Ändern
            </button>
            <button class="btn btn-danger  btn-sm" @click="$emit('delete-compRound', compRound)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompRoundList',
  emits: ['select-competition', 'delete-compRound', 'edit-compRound', 'create-compRound'],
  props: {
    compRounds: {
      type: Array,
      required: true
    },
    comps: {
      type: Array,
      required: true
    },
    selectedComp: {
      type: Object,
      required: true
    }
  },
  watch: {
    selectedComp: {
      handler(newComp) {
        console.log("newComp::", JSON.stringify(newComp));
        this.selected = newComp;
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      form: {
        compId: '',
        compName: '',
      },
      selected: this.selectedComp,

    }
  },
  methods: {

    handleCompChange(event) {
      this.form.compId = this.selected.id;
      this.form.compName = this.selected.name;

      this.$emit('select-competition', {...this.form});
    }
  }


}
;
</script>
<style scoped>
/* Change default border color */
.form-check-input {
  border-color: black;
}

</style>