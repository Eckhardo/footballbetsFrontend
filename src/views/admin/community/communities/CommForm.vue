<template>




  <div class="card mb-4">
    <div class="card-header .bg-secondary  fs-5">
      {{ editing ? 'Sport Event ändern' : 'Sport Event hinzufügen' }}
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="name" class="form-label  fw-bold">Name</label>
            <input type="text" class="form-control  w-auto border border-3 " id="name" v-model.trim="form.name" required>
          </div>
          <div class="col-auto">
            <label for="description" class="form-label  fw-bold">Beschreibung</label>
            <input type="text" class="form-control  w-auto border border-3 " id="description" v-model.trim="form.description" min="10">
          </div>
        </div>

        <div class="mb-3  p-3 ">
          <button type="submit" class="btn btn-primary">
            Sport Event {{ editing ? 'ändern' : 'speichern' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>





<script setup>
// Define props using macro (no import needed)
defineProps({
  selectedItem: {
    type: Object,
    required: true
  }
})
</script>


<style scoped>

</style>