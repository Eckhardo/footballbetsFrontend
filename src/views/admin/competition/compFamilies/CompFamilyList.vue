<template>
  <div class="card">
    <div class="card-header">
      Sport Events
    </div>
    <div class="card-body">

      <button class="btn btn-warning btn-sm me-2" @click="$emit('create-compFamily',{
              compFamily:null,
              isVisible:true
            })">Neuen Sport Event anlegen
      </button>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Beschreibung</th>
          <th>Hat Clubs</th>
          <th>Nationalität</th>
          <th>spielt im Liga Modus</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(compFamily) in compFamilies" :key="compFamily.id">
          <td>{{ compFamily.name }}</td>
          <td>{{ compFamily.description }}</td>
          <td>
            <div class="form-check">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="hasClubs"
                  v-model="compFamily.hasClubs"
                  disabled
              />
            </div>
          </td>
          <td>{{ compFamily.country }}</td>
          <td>
            <div class="form-check">
              <input
                  class="form-check-input"
                  type="checkbox"
                  disabled
                  id="hasLigaModus"
                  v-model="compFamily.hasLigaModus"
              />
            </div>
          </td>

          <td>
            <button class="btn btn-warning btn-sm me-2" @click="$emit('edit-compFamily',{
                 compFamily:compFamily,
              isVisible:true
            })">Ändern
            </button>
            <button class="btn btn-danger btn-sm" @click="$emit('delete-compFamily', compFamily)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>
export default {
  name: 'CompFamilyList',
  emits: ['create-compFamily','edit-compFamily','delete-compFamily'],
  props: {
    compFamilies: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
/* Change default border color */
.form-check-input {
  border-color: black;
}

</style>