<!-- steps/StepTwoCompetition.vue -->
<script setup>
import {defineModel} from 'vue';
const model = defineModel({ type: Object, required: true });
const handleCompChange= (event) =>{

  console.log('Native event target value:', event.target.value)

}
</script>

<template>
  <div class="step-content">
    <h3>Step 2: Wettbewerb</h3>
    <div class="row g-4 mb-3">
      <div class="col-auto">
        <label class="form-label  fw-bold" for="name"> Wettbewerb</label>
        <select id="compId" class="form-select   w-auto border border-3 "  v-model="model.competition"
                @change="handleCompChange" >
          <option disabled :value="null" hidden  >Please select one</option>

          <option v-for="(competition,index) in model.competitions" :value="competition" :key="competition.id">
            {{competition.name}}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
