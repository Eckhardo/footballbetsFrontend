<template>
  <div class="card">
    <div class="card-header">
     Teams des Wettbewerbs {{competition.name}}
    </div>
    <div class="card-body">
      <button class="btn btn-warning btn-sm me-2" @click="$emit('create-compTeam',{
              isVisible:true
            })"> Team hinzufügen
      </button>
      <table class="table table-striped table-hover">
        <thead>
        <tr>

          <th>Team</th>
          <th>ist Club</th>
          <th>Wettbewerb</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(compTeam) in compTeams[1]" :key="compTeam.id">

          <td>{{ compTeam.teamAcronym }}</td>
          <td>
            <div class="form-check">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="isClub"
                  v-model="compTeam.hasClub"
                  disabled
              />
            </div>

          </td>
          <td>{{ compTeam.compName }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompTeamList',
  emits: ['create-compTeam'],
  props: {
    competition:{
      type:Object,
      required:true
    },
    compTeams: {
      type: Array,
      required: true
    }
  }
};
</script>
<style scoped>
</style>>