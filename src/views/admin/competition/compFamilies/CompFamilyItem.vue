<template>
  <div class="card">
    <div class="card-header">
      Sport Event {{ compFamily.name }}
    </div>
    <div class="card-body">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Beschreibung</th>
          <th>Nationalität</th>
          <th>Hat Clubs</th>
          <th>spielt im Liga Modus</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{ compFamily.name }}</td>
          <td>{{ compFamily.description }}</td>
          <td>{{ compFamily.country }}</td>
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
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>
export default {
  name: 'CompFamilyItem',
  props: {
    compFamily: {
      type: Object,
      required: true
    }
  }
};
</script>>

<style scoped>
/* Change default border color */
.form-check-input {
  border-color: black;
}

</style>