<!-- CreateNewCommunityWizard.vue -->
<script setup>
import {ref, computed} from 'vue';
import StepOneCommunity from './steps/StepOneCommunity.vue';
import StepTwoCompetition from './steps/StepTwoCompetition.vue';
import LastStepConfirmation from './steps/LastStepConfirmation.vue';

// 1. Centralized Form State
const formData = ref({
  name: '',
  description: '',
  competitions: [{id:1, name:'WM 2026'}, {id:2, name:'EURO 2028'}],
  competition: null
})

// 2. Step Navigation Control
const currentStepIndex = ref(0);
const steps = [
  {title: 'Tippgemeinschaft', component: StepOneCommunity},
  {title: 'Select Wettbewerb', component: StepTwoCompetition},
  {title: 'Confirmation', component: LastStepConfirmation}
]

const currentStep = computed(() => steps[currentStepIndex.value]);
const isFirstStep = computed(() => currentStepIndex.value === 0);
const isLastStep = computed(() => currentStepIndex.value === steps.length - 1);

// 3. Navigation Methods
function nextStep() {
  if (!isLastStep.value) {
    currentStepIndex.value++
  }
}

function prevStep() {
  if (!isFirstStep.value) {
    currentStepIndex.value--
  }
}

function submitForm() {
  // Process the final reactive payload
  console.log('Form Submitted successfully:', JSON.stringify(formData.value))
  alert('Wizard Complete!')
}
</script>

<template>
  <div class="wizard-container">
    <!-- Progress Indicator Header -->
    <header class="wizard-header">
      <div
          v-for="(step, index) in steps"
          :key="index"
          :class="['step-tab', { active: currentStepIndex === index, completed: currentStepIndex > index }]"
      >
        <span class="step-number">{{ index + 1 }}</span>
        <span class="step-title">{{ step.title }}</span>
      </div>
    </header>

    <!-- Dynamic Step Wrapper -->
    <main class="wizard-body">
      <component
          :is="currentStep.component"
          v-model="formData"
      />
    </main>

    <!-- Navigation Actions Footer -->
    <footer class="wizard-footer">
      <button class="btn btn-primary"
              type="button"
              :disabled="isFirstStep"
              @click="prevStep"
      >
        Back
      </button>

      <button
          v-if="!isLastStep"
          class="btn btn-primary"
          type="button"
          @click="nextStep"
      >
        Next
      </button>

      <button
          v-else
          type="button"
          class="btn btn-primary"
          @click="submitForm"
      >
        Submit
      </button>
    </footer>
  </div>
</template>

<style scoped>
.wizard-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.wizard-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.step-tab {
  opacity: 0.5;
  font-weight: bold;
}

.step-tab.active {
  opacity: 1;
  color: #42b883;
}

.step-tab.completed {
  color: #35495e;
  opacity: 0.8;
}

.step-number {
  background: #eee;
  padding: 2px 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.wizard-body {
  min-height: 200px;
  margin-bottom: 2rem;
}

.wizard-footer {
  display: flex;
  justify-content: space-between;
}

.submit-btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
