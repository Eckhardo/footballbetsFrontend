
<template>

  <div class="card mb-4">
    <div class="card-header .bg-secondary  fs-5">
      TippModus  ändern
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="competitionName" class="form-label  fw-bold">Wettbewerb</label>
            <input type="text" class="form-control  w-auto border border-3 " id="competitionName" v-model="formData.competitionName"
                   readonly>
          </div>
          <div class="col-auto">
            <label for="roundName" class="form-label  fw-bold">Runde</label>
            <input type="text" class="form-control  w-auto border border-3 " id="roundName" v-model="formData.roundName"
                   readonly>
          </div>
          <div class="col-auto">
            <label for="spieltagNumber" class="form-label  fw-bold">Spieltag Nummer</label>
            <input type="text" class="form-control  w-auto border border-3 " id="spieltagNumber" v-model="formData.spieltagNumber"
                   readonly>
          </div>
        </div>
        <div>
          <label for="compId" class="form-label  fw-bold">Tipp Modus:</label>
          <!-- Use Bootstrap's form-select class for styling -->
          <select id="compId" class="form-select  w-auto border border-3 " v-model="formData.tippModusName"
                  @change="handleTippModusChange" required>
            <option v-for="modus in tippModi" :value="modus" :key="modus.id">
              {{ modus.name }}
            </option>
          </select>
        </div>
        <div class="mb-3  p-3 ">
          <button type="submit" class="btn btn-primary">
            Speichern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import {defineEmits, defineProps, ref, watch} from 'vue'
// Define props using macro (no import needed)
const props=defineProps({
  item: {
    type: Object,
    required: true
  },
  tippModi: {
    type: Array,
    required: true
  }
});

const initialForm = {
  competitionName: '',
  roundName: '',
  spieltagNumber: '',
  tippModusName: '',
};

// Initialize with a shallow copy
const formData = ref({...initialForm})

const resetForm = () => {
  // Simple and clean reset
  formData.value = {...initialForm}
}
const emit = defineEmits(['save-item']);


// Änderungen an den Parent senden
const handleSubmit = () => {
  resetForm();
  emit('save-item', formData.value)
}


const handleTippModusChange= (event)=> {
  console.log("tippModusName", JSON.stringify(event.target.value));
  formData.value.tippModusName = event.target.value;

}


// Watcher reagiert auf Änderungen des übergebenen Objekts
watch(
    () => props.item,
    (newItem) => {
      if (newItem) {
        console.log(":new item", JSON.stringify(newItem));
        // Tiefenkopie erstellen, um Referenzen zu trennen
        formData.value = {...newItem};

      }
    },
    {immediate: true, deep: true}
)
</script>

<style scoped>

</style>