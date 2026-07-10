<!-- steps/StepFourTippModus.vue -->

<script setup>
import {defineModel, defineEmits} from 'vue';

const model = defineModel({type: Object, required: true});

const handleSubmit = () => {
  const copy = { ...model.value.selectedTippModus };
  console.log('add modus:', JSON.stringify(copy));
  model.value.selectedTippModi.push(copy);
  model.value.selectedTippModus.name='';
}
const deleteItem = (item) => {
  const copy = { ...item };
  console.log('add modus:', JSON.stringify(copy));
  model.value.selectedTippModi.pop(copy);
}
</script>

<template>
  <div v-if="model.selectedTippModi.length>0" class="card-body">

    <h5>Meine TippModi</h5>
    <table class="table table-striped table-hover">
      <thead>
      <tr>
        <th>Typ</th>
        <th>Name</th>
        <th>Deadline</th>
        <th v-if="model.selectedTippModus.type==='ResultTipp'">Tendenz Punkte</th>
        <th v-if="model.selectedTippModus.type==='ResultTipp'">Bonus Punkte</th>
        <th v-if="model.selectedTippModus.type==='PointTipp'">Gesamte Punkte</th>
        <th>Aktion</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item) in model.selectedTippModi" :key="item.id">
        <td> {{ item.type }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.deadline }}</td>
        <td v-if="item.type==='ResultTipp'">{{ item.tendencyPoints }}</td>
        <td v-if="item.type==='ResultTipp'">{{ item.bonusPoints }}</td>
        <td v-if="item.type==='PointTipp'">{{ item.totalPoints }}</td>
        <td><button class="btn btn-danger btn-sm" @click="deleteItem( item)">Löschen</button></td>
      </tr>
      </tbody>
    </table>
  </div>
  <div class="card-body">
    <h5>Step 5: TippModus konfigurieren</h5>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="name" class="form-label  fw-bold">Type</label>
            <input type="text" class="form-control  w-auto border border-3 " id="name"
                   v-model="model.selectedTippModus.type"
                   required>
          </div>
          <div class="col-auto">
            <label for="name" class="form-label  fw-bold">Name</label>
            <input type="text" class="form-control  w-auto border border-3 " id="name"
                   v-model="model.selectedTippModus.name"
                   required>
          </div>
          <div class="col-auto">
            <label for="description" class="form-label  fw-bold">Deadline (Minuten vor Spielbeginn)</label>
            <input type="number" class="form-control  w-auto border border-3 " id="description"
                   v-model="model.selectedTippModus.deadline" min="0">
          </div>
          <div v-if="model.selectedTippModus.type==='ResultTipp'" class="col-auto">
            <label for="description" class="form-label  fw-bold">Tendenz Punkte</label>
            <input type="number" class="form-control  w-auto border border-3 " id="description"
                   v-model="model.selectedTippModus.tendencyPoints" min="1">
          </div>
          <div v-if="model.selectedTippModus.type==='ResultTipp'" class="col-auto">
            <label for="description" class="form-label  fw-bold">Bonus Punkte</label>
            <input type="number" class="form-control  w-auto border border-3 " id="description"
                   v-model="model.selectedTippModus.bonusPoints" min="0">
          </div>

          <div v-if="model.selectedTippModus.type==='PointTipp'" class="col-auto">
            <label for="description" class="form-label  fw-bold">Gesamte Punkte</label>
            <input type="number" class="form-control  w-auto border border-3 " id="description"
                   v-model="model.selectedTippModus.totalPoints" min="1">
          </div>
        </div>

        <div class="mb-3  p-3 ">
          <button type="submit" class="btn btn-primary">
            TippModus hinzufügen
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
