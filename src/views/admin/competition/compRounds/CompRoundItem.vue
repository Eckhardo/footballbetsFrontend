<template>
  <div v-if="compRounds" class="card">
    <div class="card-header">
      Runden des Wettbewerbs {{ compName }}
    </div>
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>laufende Nummer</th>
          <th>hat Gruppen</th>
          <th>Wettbewerb</th>
          <th># Teams</th>
          <th># Spieltage</th>
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
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompRoundItem',
  props: {
    compRounds: {
      type: Array,
      required: true
    },
    compName: String
  }
};
</script>
<style scoped>
/* Change default border color */
.form-check-input {
  border-color: black;
}
</style>