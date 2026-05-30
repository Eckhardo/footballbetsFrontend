<template>
  <div class="card">
    <div class="card-header">
      Spieltage (Hin - und Rückrunde)
    </div>
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>laufende Nummer</th>
          <th>Datum</th>
          <th>Runde</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(matchday) in matchdays" :key="matchday.id">
          <td>{{ matchday.spieltagNumber }}</td>
          <td>{{ matchday.startDate }}</td>
          <td>{{ matchday.compRoundName }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchdayList',
  props: {
    matchdays: {
      type: Array,
      required: true
    }
  }
};
</script>
<style scoped>
</style>