<!-- steps/StepFourTippModus.vue -->

<script setup>
import {defineModel} from 'vue';
const model = defineModel({ type: Object, required: true });

</script>

<template>
  <div class="card-body">
    <h5>Step 4: TippModus</h5>
    <table class="table table-striped table-hover">
      <thead>
      <tr>
        <th>Auswahl</th>
        <th>Name</th>
        <th>Beschreibung</th>

      </tr>
      </thead>
      <tbody>
      <tr v-for="(item) in model.tippModi" :key="item.id">
        <td>   <input
            type="radio"
            name="table-selection"
            :value="item"
            v-model="model.selectedTippModus"
        /></td>
        <td>{{ item.name }}</td>
        <td style="
      width: 50ch;
      max-width: 50ch;
      word-wrap: break-word;
      word-break: break-all;
      overflow-wrap: break-word;">{{ item.description }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
