<!-- steps/LastStepConfirmation.vue -->
<script setup>
import {defineModel} from 'vue';

const model = defineModel({type: Object, required: true});
</script>

<template>
  <div class="step-content">
    <h3>Step 3: Review Details</h3>
    <div class="summary-card">
      <p><strong>Name:</strong> {{ model.name }}</p>
      <p><strong>Beschreibung:</strong> {{ model.description }}</p>
      <p><strong>Wettbewerb:</strong> {{ model.competition.name }}</p>
      <p><strong>Teilnehmer:</strong>  <span v-for="(item, index) in model.tippers[1]" :key="index">
    {{ item.username }}<span v-if="index < model.tippers[1].length - 1">, </span>
  </span>   </p>
      <p><strong>TippModi:</strong>  <span v-for="(item, index) in model.selectedTippModi" :key="index">
    {{ item.type }}<span v-if="index < model.selectedTippModi.length - 1">, </span>
  </span>   </p>
    </div>
  </div>
</template>
