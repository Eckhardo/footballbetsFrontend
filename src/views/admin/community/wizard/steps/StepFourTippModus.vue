<!-- steps/StepThreeTippers.vue -->
<!-- steps/StepTwoCompetition.vue -->
<script setup>
import {defineModel} from 'vue';
const model = defineModel({ type: Object, required: true });
const editItem= (item) =>{

  console.log('add:', JSON.stringify(item));
model.value.selectedTippModi.push(item);
}
const deleteItem= (item) =>{

  console.log('delete:',JSON.stringify(item));
  model.value.selectedTippModi.pop(item);
}
</script>

<template>
  <div class="card-body">
    <h5>Step 4: TippModi</h5>
    <table class="table table-striped table-hover">
      <thead>
      <tr>
        <th>Name</th>
        <th>Beschreibung</th>
        <th>Aktionen</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item) in model.tippModi" :key="item.id">
        <td>{{ item.name }}</td>
        <td style="
      width: 50ch;
      max-width: 50ch;
      word-wrap: break-word;
      word-break: break-all;
      overflow-wrap: break-word;">{{ item.description }}</td>
        <td>
          <button class="btn btn-warning btn-sm me-2" @click="editItem(item)">Hinzufügen</button>
          <button class="btn btn-danger btn-sm" @click="deleteItem( item)">Löschen </button>
          </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
