<template>
  <div class="card">
    <h5 v-if="isClub" class="card-header">
      Aktuelle Clubs
    </h5>
   <h5 v-else class="card-header">
     Aktuelle Nationen
   </h5>
    <div class="row mb-3  p-3">
      <div class="col-auto">
        <button class="btn btn-warning btn-sm me-2" @click="$emit('show-clubs')"><b>Clubs</b></button>
      </div>
      <div class="col-auto">
        <button class="btn btn-warning btn-sm me-2"@click="$emit('show-nations')" ><b>Nationen</b></button>
      </div>
    </div>
    <div class="card-body">
      <button class="btn btn-warning btn-sm me-2" @click="$emit('create-team',{
              isVisible:true
            })">Neues Team anlegen
      </button>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Kürzel</th>
          <th>ist Club</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(team) in teams" :key="team.id">
          <td>{{ team.name }}</td>
          <td>{{ team.acronym }}</td>
          <td>
            <div class="form-check">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="isClub"
                  v-model="team.hasClub"
                  disabled
              />
            </div>
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="$emit('edit-team',{
              team:team,
              isVisible:true
            })">Ändern
            </button>
            <button class="btn btn-danger btn-sm" @click="$emit('delete-team', team)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamList',
  emits: ['create-team', 'edit-team', 'delete-team','show-clubs','show-nations'],
  props: {
    teams: {
      type: Array,
      required: true
    },
    isClub: {
      type: Boolean,
    }
  },
};
</script>
<style scoped>
.form-check-input {
  border-color: black;
}
</style>