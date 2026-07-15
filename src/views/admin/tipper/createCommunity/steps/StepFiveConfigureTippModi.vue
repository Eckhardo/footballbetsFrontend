<!-- steps/StepFourTippModus.vue -->

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
        <td>
          <button :disabled="isListEmpty" class="btn btn-warning btn-sm me-2" @click="changeItem( item)">Ändern</button>
          <button :disabled="isListEmpty" class="btn btn-danger btn-sm" @click="deleteItem( item)">Löschen</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <div class="card-body">
    <h5>Step 5: TippModus konfigurieren</h5>
    <div class="card-body">
      <form @submit.prevent>
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="name" class="form-label  fw-bold">Type</label>
            <input type="text" class="form-control  w-auto border border-3 " id="name"
                   v-model="model.selectedTippModus.type"
                   readonly>
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

        <div v-if="isUpdate===false" class="mb-3  p-3 ">
          <button type="button" class="btn btn-primary" @click="handleAdd">
            TippModus hinzufügen
          </button>
        </div>
        <div v-else class="mb-3  p-3 ">
          <button type="button" class="btn btn-primary"  @click="handleUpdate">
            TippModus ändern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref,defineModel,computed} from 'vue';

const model = defineModel({type: Object, required: true});
const isUpdate=ref(false);

const handleAdd = () => {
  const copy = {...model.value.selectedTippModus};
  console.log('add modus:', JSON.stringify(copy));
  model.value.selectedTippModi.push(copy);
  model.value.selectedTippModus.name = '';
}
const handleUpdate = () => {
  const copy = {...model.value.selectedTippModus};
  console.log('add modus:', JSON.stringify(copy));
  let name = copy.name;

  let index = model.value.selectedTippModi.findIndex(modus => modus.name === name);
  if (index !== -1) {
    model.value.selectedTippModi.splice(index, 1);
  }
  model.value.selectedTippModi.push(copy);
  isUpdate.value = false;

  model.value.selectedTippModus.name = '';
}
const deleteItem = (item) => {
  const copy = {...item};
  console.log('delete modus:', JSON.stringify(copy));
  let name = copy.name;

  let index = model.value.selectedTippModi.findIndex(modus => modus.name === name);
  if (index !== -1) {
    model.value.selectedTippModi.splice(index, 1);
  }
}
const changeItem = (item) => {
  console.log('change modus:', JSON.stringify(item));
  const copy = {...item};
  let name = copy.name;
  const selectedModus = model.value.selectedTippModi.find(modus => modus.name === name);
  model.value.selectedTippModus =selectedModus;
  isUpdate.value = true;
}

const isListEmpty = computed(() => model.value.selectedTippModi.length === 0)
</script>
