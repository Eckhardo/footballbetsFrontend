<!-- steps/LastStepConfirmation.vue -->
<script setup>
import {defineModel} from 'vue';
const model = defineModel({ type: Object, required: true });
</script>

<template>
  <div class="step-content">
    <h3>Step 3: Review Details</h3>
    <div class="summary-card">
      <p><strong>Name:</strong> {{ model.name || 'Not filled' }}</p>
      <p><strong>Beschreibung:</strong> {{ model.description || 'Not filled' }}</p>
      <p><strong>Selected Competition:</strong> {{ model.competition.name }}</p>
    </div>
  </div>
</template>
