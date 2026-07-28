<template>
  <div class="bets-container">
    <h5>TippModus {{ editing ? 'ändern' : 'hinzufügen' }}</h5>

    <form @submit.prevent="handleSubmit">
      <div class="row g-4 mb-3">
        <div class="col-auto">
          <label for="name" class="form-label  fw-bold">Type</label>
          <input type="text" class="form-control  w-auto border border-3 " id="name"
                 v-model="formData.type" readonly>
        </div>
        <div class="col-auto">
          <label for="name" class="form-label  fw-bold">Name</label>
          <input type="text" required class="form-control  w-auto border border-3 " id="name"
                 v-model="formData.name" placeholder="New Name" v-on:focusout="validate"
          >
        </div>
        <div class="col-auto">
          <label for="deadline" class="form-label  fw-bold">Deadline (Minuten vor Spielbeginn)</label>
          <input type="number" class="form-control  w-auto border border-3 " id="deadline"
                 v-model="formData.deadline" min="0">
        </div>
        <div v-if="modusReference.type==='ResultTipp'" class="col-auto">
          <label for="tendencyPoints" class="form-label  fw-bold">Tendenz Punkte</label>
          <input type="number" class="form-control  w-auto border border-3 " id="tendencyPoints"
                 v-model="formData.tendencyPoints" min="1">
        </div>
        <div v-if="modusReference.type==='ResultTipp'" class="col-auto">
          <label for="bonusPoints" class="form-label  fw-bold">Bonus Punkte</label>
          <input type="number" class="form-control  w-auto border border-3 " id="bonusPoints"
                 v-model="formData.bonusPoints" min="0">
        </div>

        <div v-if="modusReference.type==='PointTipp'" class="col-auto">
          <label for="totalPoints" class="form-label  fw-bold">Gesamte Punkte</label>
          <input type="number" class="form-control  w-auto border border-3 " id="totalPoints"
                 v-model="formData.totalPoints" min="1">
        </div>
      </div>
      <div class="mb-3  p-3 ">
        <button type="submit" class="btn btn-primary">
          Speichern
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import {defineEmits, defineProps, ref, toRef, watch} from 'vue'
import {saveMessage} from "@/util/errorMessages.js";
import TippModusDataService from "../../../../service/tipps/TippModusDataService.js";
// Define props using macro (no import needed)
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  tippModusReference: {
    type: Object,
    required: true
  }
  ,
  tippModi: {
    type: Array,
    default: () => []
  }
});
const modusReference = toRef(props, 'tippModusReference');
const currentModi = toRef(props, 'tippModi');

const initialForm = {
  id: '',
  name: '',
  type: '',
  deadline: 0,
  commId: '',
  commName: '',
  selectedTippModus: '',
  bonusPoints: '',
  totalPoints: ''
};
const editing = ref(false);
// Initialize with a shallow copy
const formData = ref({...initialForm})

const resetForm = () => {
  // Simple and clean reset
  formData.value = {...initialForm}
}
const emit = defineEmits(['save-item']);


const handleSubmit = () => {


  emit('save-item', formData.value)


}
const validate = (value) => {
  if (isDuplicate(value)) {
    handleError('Name is not unique');
  }
}

const handleError = (message) => {
  const error = {
    response: {
      data: {
        detail: message
      }
    }
  }
  setError(saveMessage(error));
}


const isDuplicate = (name) => {
  for (const modus in currentModi.value) {
    if (modus.name === name) {
      return true;
    }
  }
  return false;
}

// Watcher reagiert auf Änderungen des übergebenen Objekts
watch(
    () => props.item,
    (newItem) => {
      if (newItem) {
        console.log(":new item", JSON.stringify(newItem));
        // Tiefenkopie erstellen, um Referenzen zu trennen
        formData.value = {...newItem};

        editing.value = true;
      } else {
        console.log("newItem");
        resetForm();
        editing.value = false;
        formData.value.type = modusReference.value.type;
        formData.value.commId = modusReference.value.commId;
        formData.value.commName = modusReference.value.commName;
      }
    },
    {immediate: true, deep: true}
)
</script>
<style scoped>

</style>