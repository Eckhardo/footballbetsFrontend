
<template>
  <div class="bets-container">
  <h5>Meine TippModi</h5>

  <table class="table table-striped table-hover">
    <thead>
    <tr>
      <th>Typ</th>
      <th>Name</th>
      <th>Deadline</th>
      <th v-if="tippModi[0].type==='ResultTipp'">Tendenz Punkte</th>
      <th v-if="tippModi[0].type==='ResultTipp'">Bonus Punkte</th>
      <th v-if="tippModi[0].type==='PointTipp'">Gesamte Punkte</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item) in tippModi" :key="item.id">
      <td> {{ item.type }}</td>
      <td>{{ item.name }}</td>
      <td>{{ item.deadline }}</td>
      <td v-if="item.type==='ResultTipp'">{{ item.tendencyPoints }}</td>
      <td v-if="item.type==='ResultTipp'">{{ item.bonusPoints }}</td>
      <td v-if="item.type==='PointTipp'">{{ item.totalPoints }}</td>
    </tr>
    </tbody>
  </table>
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
          <select id="compId" class="form-select  w-auto border border-3 " v-model="selectedTippModus"
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

const selectedTippModus = ref(null);
const initialForm = {
  id:'',
  competitionName: '',
  compMembId:'',
  roundName: '',
  tippModusId:'',
  tippModusName: '',
  spieltagId:'',
  spieltagNumber: '',
};

// Initialize with a shallow copy
const formData = ref({...initialForm})

const resetForm = () => {
  // Simple and clean reset
  formData.value = {...initialForm}
}
const emit = defineEmits(['save-item']);




const handleTippModusChange= ()=> {

  formData.value.tippModusName =selectedTippModus.value.name;
  formData.value.tippModusId =selectedTippModus.value.id;
  console.log(" formData.value::", JSON.stringify( formData.value));

  emit('save-item', formData.value);
  resetForm();

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
.bets-container {
  max-width: 850px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>