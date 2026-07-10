<!-- CreateNewCommunityWizard.vue -->
<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();

import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import StepOneCommunity from './steps/StepOneCommunity.vue';
import StepTwoCompetition from './steps/StepTwoCompetition.vue';
import StepThreeTippers from './steps/StepThreeTippers.vue';
import StepFourTippModus from "./steps/StepFourTippModus.vue";
import LastStepConfirmation from './steps/LastStepConfirmation.vue';

import {useError} from '@/composables/useError.js';
import {useMessage} from '@/composables/useMessage.js';
import {saveMessage} from "@/util/errorMessages.js";

const {setMessage} = useMessage();
const {setError} = useError();

import CompDataService from "../../../../service/competition/CompDataService.js";
import TipperDataService from "../../../../service/community/TipperDataService.js";
import CommunityWizardDataService from "../../../../service/community/CommunityWizardDataService.js";
import TippModusDataService from "../../../../service/community/TippModusDataService.js";
import StepFiveConfigureTippModi from "./steps/StepFiveConfigureTippModi.vue";


// Reactive states
// Instantiate the global store
const umsInfoStore = useUmsInfoStore();
const {username, loggedIn,defaultCommunityId} = storeToRefs(umsInfoStore);
const MIN_LENGTH = 5;
// 1. Centralized Form State
const formData = ref({
  name: 'Ebi Test',
  description: 'Test description',
  competitions: [],
  competition: null,
  tippModusTypes: [],
  selectedTippModi: [],
  selectedTippModus: null,
  tippers: [
    [],
    []
  ]
})

// 2. Step Navigation Control
const currentStepIndex = ref(0);
// 3. Computed validation error message
const commNameError = computed(() => {
  const len = formData.value.name.length

  if (len === 0) {
    return 'Name is required.'
  }
  if (len < MIN_LENGTH) {
    return `Name must be at least ${MIN_LENGTH} characters.`;
  }

  return '' // No errors
})
const isFormInvalid = computed(() => commNameError.value !== '');
const steps = [
  {title: 'Tippgemeinschaft', component: StepOneCommunity},
  {title: 'Wettbewerb', component: StepTwoCompetition},
  {title: 'Tipper', component: StepThreeTippers},
  {title: 'TippModus 1', component: StepFourTippModus},
  {title: 'TippModus 2', component: StepFiveConfigureTippModi},
  {title: 'Confirmation', component: LastStepConfirmation},
]
const currentStep = computed(() => steps[currentStepIndex.value]);
const isFirstStep = computed(() => currentStepIndex.value === 0);
const isLastStep = computed(() => currentStepIndex.value === steps.length - 1);

// 3. Navigation Methods
const nextStep = () => {
  let errorMessage = validateCurrentStep();
  if (errorMessage) {
    const error = {
      response: {
        data: {
          detail: errorMessage
        }
      }
    }
    setError(saveMessage(error));

  } else {
    if (!isLastStep.value) {
      currentStepIndex.value++;
    }
  }
}

const prevStep = () => {
  if (!isFirstStep.value) {
    currentStepIndex.value--
  }
}
// 3. Validation logic for the current step
const validateCurrentStep = () => {
  if (currentStepIndex.value === 0) {
    if (!formData.value.name) return ' Name is required.';
    if (formData.value.name.length < 5) return ' Name must be at least 5 characters.';
    if (!formData.value.description) return 'Description is required.';
  }
  else if (currentStepIndex.value === 1) {
    if (!formData.value.competition) return 'Competition is required.';
  }
  else if (currentStepIndex.value === 2) {
    if (!formData.value.tippers[1].length > 0) return 'Tipper is required.';
  }
  else if (currentStepIndex.value === 3) {
    if (formData.value.selectedTippModus === null) return 'TippModus is required.';
  }
  else if (currentStepIndex.value === 3) {
    if (formData.value.selectedTippModi.length <0) return 'TippModus is required.';
  }
  return null; // Null means no errors
};


const submitForm = async () => {
  if (isFormInvalid.value) {
    const error = {
      response: {data: {detail: commNameError.value}}
    }
    setError(saveMessage(error));
    return;
  }
  const myTippers = formData.value.tippers[1];
  const tipperIds = myTippers.map(tipper => tipper.id);
  const {name, description, competition} = formData.value;
  const tipperUserName = username.value;
  const submitForm = {
    commName: name,
    commDescription: description,
    compId: competition.id,
    compName: competition.name,
    tipperUserName,
    tipperIds,
    tippModi:formData.value.selectedTippModi
  };
  console.log("commForm: ", JSON.stringify(submitForm));
  try {
    const response = await CommunityWizardDataService.create(submitForm);
    if (response.status === 201) {
      console.info("data:", JSON.stringify(response.data));

      const commMemb = response.data;
      console.info("selectedCommunity: ", commMemb);
      // Navigation zu einer Route mit Namen und Parametern
      router.push({
        name: 'CommMemb',
        params: {
          commId: commMemb.commId,
          compId: commMemb.compId
        }
      })

    }
  } catch (err) {
    console.error("ERROR create item:", JSON.stringify(err));
    setError(saveMessage(err));
  }
}
/**
 * fetch competitions
 *
 * @returns {Promise<void>}
 */
const fetchCompetitions = async () => {
  try {
    const response = await CompDataService.getAll();
    formData.value.competitions = response.data;
    if (formData.value.competitions.length !== 0) {
      formData.value.competition = formData.value.competitions[0];
    }
  } catch (err) {
    console.error("ERROR retrieve competitions", JSON.stringify(err));
    setError(saveMessage(err));
  }
}
/**
 *
 * @returns {Promise<void>}
 */
const fetchTippers = async () => {
  try {
    const response = await TipperDataService.getAll();
    formData.value.tippers[0] = response.data;
  } catch (err) {
    console.error("ERROR retrieve tippers", JSON.stringify(err));
    setError(saveMessage(err));
  }
}
const fetchTippModi = async () => {
  try {
    const response = await TippModusDataService.getModiTypes(defaultCommunityId.value);
    formData.value.tippModusTypes = response.data;

    for(const modus of formData.value.tippModusTypes) {
      console.log(JSON.stringify(modus));
    }
  } catch (err) {
    console.error("ERROR retrieve tippModi", JSON.stringify(err));
    setError(saveMessage(err));
  }
}

/**
 *  mount mandatory data calls
 */
onMounted(() => {
  fetchCompetitions();
  fetchTippers();
  fetchTippModi();
})
</script>

<template>
  <div v-if="loggedIn" class="wizard-container">
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
