<template>

  <div class="card mb-4">
    <div class="card-header .bg-secondary  fs-5">
    Tippgemeinschaft  {{ editing ? 'ändern' : 'hinzufügen' }}
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="name" class="form-label  fw-bold">Name</label>
            <input type="text" class="form-control  w-auto border border-3 " id="name" v-model="formData.name"
                   required>
          </div>
          <div class="col-auto">
            <label for="description" class="form-label  fw-bold">Beschreibung</label>
            <input type="text" class="form-control  w-auto border border-3 " id="description"
                   v-model="formData.description" min="10">
          </div>
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
    required: false
  }
});
//Lokaler Formular-Zustand (verhindert direkte Prop-Mutation)
const formData = ref({name: '', description: ''});
const editing = ref(false);
const emit = defineEmits(['save-item']);

// Änderungen an den Parent senden
const handleSubmit = () => {
  emit('save-item', formData.value)
}

// Watcher reagiert auf Änderungen des übergebenen Objekts
watch(
    () => props.item,
    (newItem) => {
      if (newItem) {
        console.log(":new item",JSON.stringify(newItem));
        // Tiefenkopie erstellen, um Referenzen zu trennen
        formData.value = {...newItem};
        editing.value = true;
      }
      else {
        console.log("newItem");
        editing.value = false;
      }
    },
    {immediate: true, deep: true}
)
</script>


<style scoped>

</style>