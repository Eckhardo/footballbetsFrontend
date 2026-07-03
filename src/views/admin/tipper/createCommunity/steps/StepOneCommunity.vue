<!-- components/StepOneCommunity.vue -->
<script setup>
import {defineModel} from 'vue';
// Capture the master modelValue property
const model = defineModel({type: Object, required: true});
</script>

<template>
  <div class="card-body">
    <h5>Step 1: Tippgemeinschaft</h5>
    <div class="row g-4 mb-3">
      <div class="col-auto">
        <label class="form-label  fw-bold" for="name"> Name</label>
        <input id="name" v-model="model.name" type="text" class="form-control  w-auto border border-3 "
               placeholder="Ebi Test" minlength="5"/>
      </div>
      <div class="col-auto">
        <label class="form-label  fw-bold" for="email">Beschreibung</label>
        <input id="description" v-model="model.description" type="text" class="form-control  w-auto border border-3 "
               placeholder="Beschreibung" required/>
      </div>
    </div>
  </div>
</template>
