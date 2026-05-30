<template>
  <div class="card">
    <div class="card-header">

      Wettbewerb: {{ competition.name }}
    </div>
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Beschreibung</th>
          <th>Punkte für Sieg</th>
          <th>Punkte für Remis</th>
          <th>Sport Event</th>

        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{ competition.name }}</td>
          <td>{{ competition.description.substring(0, 20) }}</td>
          <td>{{ competition.winMultiplicator }}</td>
          <td>{{ competition.remisMultiplicator }}</td>
          <td>{{ competition.familyName }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>
export default {
  name: 'CompItem',
  props: {
    competition: {
      type: Object,
      required: true
    }
  }
};
</script>
<style scoped>
</style>