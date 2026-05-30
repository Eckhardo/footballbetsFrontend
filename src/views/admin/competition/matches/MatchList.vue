<template>
  <div class="card">
    <div class="card-header fw-bold">
      Spiele des Spieltages {{selectedMatchday.spieltagNumber}} ( {{ selected.compRoundName }})
    </div>
    <div class="mb-3  p-3 border rounded">
      <div>
        <label for="roundId" class="form-label fw-bold">Spieltag auswählen  </label>
        <!-- Use Bootstrap's form-select class for styling -->
        <form>
          <select id="roundId" class="form-select w-auto" v-model="selected" @change="handleMatchdayChange">
            <option v-for="matchday in matchdays" :value="matchday" :key="matchday.id">
              {{ matchday.spieltagNumber }}. Spieltag
            </option>
          </select>
        </form>
      </div>
    </div>
    <div class="card-body">
      <div class="row mb-3  p-1">
        <div class="col-auto">
      <button class="btn btn-warning btn-sm me-2" @click="$emit('create-match',{
              isVisible:true
            })">Neues Spiel anlegen
      </button>
        </div>
        <div class="col-auto">
          <button class="btn btn-warning btn-sm me-2" @click="$emit('create-matches',{
              isVisible:true,
              selectedMatchday:selected,
            })">Spiele anlegen
          </button>
        </div>
      </div>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Spieltag</th>
          <th >Anpfiff</th>
          <th >Heim</th>
          <th >Gast</th>
          <th >HeimTore</th>
          <th >GastTore</th>
          <th >stattgefunden</th>
          <th >Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(match) in matches" :key="match.id">
          <td>{{ match.spieltagNumber }}</td>
          <td>{{ match.anpfiffdate }}</td>
          <td>{{ match.heimTeamAcronym }}</td>
          <td>{{ match.gastTeamAcronym }}</td>
          <td>{{ match.heimTore }}</td>
          <td>{{ match.gastTore }}</td>
          <td>
            <div class="form-check">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="stattgefunden"
                  v-model="match.stattgefunden"
                  disabled
              />
            </div>
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="$emit('edit-match',{
              match:match,
              isVisible:true
            })">Ändern
            </button>
            <button class="btn btn-danger btn-sm" @click="$emit('delete-match', match)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchList',
  emits: ['select-matchday', 'create-match','create-matches', 'edit-match', 'delete-match'],
  props: {
    matchdays: {
      type: Array,
      required: true
    },
    matches: {
      type: Array,
      required: true
    },
    selectedMatchday: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        matchdayId: '',
        matchdayNumber: '',
      },
      selected: this.selectedMatchday,

    }

  },
  methods: {


    handleMatchdayChange(event) {
      this.form.matchdayId = this.selected.id;
      this.form.matchdayNumber = this.selected.spieltagNumber;

      this.$emit('select-matchday', {...this.form});
    }
  },
};
</script>
<style scoped>
.form-check-input {
  border-color: black;
}
</style>