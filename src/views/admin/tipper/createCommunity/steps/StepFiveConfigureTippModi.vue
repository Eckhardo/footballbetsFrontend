<!-- steps/StepFourTippModus.vue -->

<script setup>
import {defineModel} from 'vue';

const model = defineModel({type: Object, required: true});
const editItem = (item) => {

  console.log('add:', JSON.stringify(item));
  model.value.selectedTippModus.push(item);
}
const deleteItem = (item) => {

  console.log('delete:', JSON.stringify(item));
  model.value.selectedTippModus.pop(item);
}
</script>

<template>
  <div class="card-body">
    <h5>Step 5: TippModus konfigurieren</h5>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="name" class="form-label  fw-bold">Type</label>
            <input type="text" class="form-control  w-auto border border-3 " id="name" v-model="model.selectedTippModus.type"
                   required>
          </div>
          <div class="col-auto">
            <label for="name" class="form-label  fw-bold">Name</label>
            <input type="text" class="form-control  w-auto border border-3 " id="name" v-model="model.selectedTippModus.name"
                   required>
          </div>
          <div class="col-auto">
            <label for="description" class="form-label  fw-bold">Deadline</label>
            <input type="number" class="form-control  w-auto border border-3 " id="description"
                   v-model="model.selectedTippModus.deadline" min="0">
          </div>
          <div v-if="model.selectedTippModus.type==='ResultTipp'" class="col-auto">
            <label for="description" class="form-label  fw-bold">Tendenz Punkte</label>
            <input type="number" class="form-control  w-auto border border-3 " id="description"
                   v-model="model.selectedTippModus.tendencyPoints" min="1">
          </div>
          <div v-if="model.selectedTippModus.type==='ResultTipp'" class="col-auto">
            <label for="description" class="form-label  fw-bold">Bonus</label>
            <input type="number" class="form-control  w-auto border border-3 " id="description"
                   v-model="model.selectedTippModus.bonusPoints" min="0">
          </div>

          <div v-if="model.selectedTippModus.type==='PointTipp'" class="col-auto">
            <label for="description" class="form-label  fw-bold">Gesamte Punkte</label>
            <input type="number" class="form-control  w-auto border border-3 " id="description"
                   v-model="model.selectedTippModus.totalPoints" min="1">
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
