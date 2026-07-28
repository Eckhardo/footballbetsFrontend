<template>

  <div class="card mb-4">
    <div class="card-header .bg-secondary  fs-5">
      Tipper {{ editing ? 'ändern' : 'hinzufügen' }}
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="row g-4 mb-3">
          <div class="col-auto">
            <label for="firstname" class="form-label  fw-bold">Vorname</label>
            <input type="text" class="form-control  w-auto border border-3 " id="firstname" v-model="formData.firstname"
                   required>
          </div>
          <div class="col-auto">
            <label for="lastname" class="form-label  fw-bold">Nachname</label>
            <input type="text" class="form-control  w-auto border border-3 " id="lastname"
                   v-model="formData.lastname" min="2">
          </div>
          <div class="col-auto">
            <label for="username" class="form-label  fw-bold">Username</label>
            <input type="text" class="form-control  w-auto border border-3 " id="username"
                   v-model="formData.username" min="5">
          </div>
          <div class="col-auto">
            <label for="email" class="form-label  fw-bold">Email</label>
            <input type="email" class="form-control  w-auto border border-3 " id="email"
                   v-model="formData.email">
          </div>
          <div class="row g-4">
            <div class="col-auto">
              <label for="passwort" class="form-label  fw-bold">Password</label>
              <input type="password" class="form-control  w-auto border border-3 " id="passwort"
                     v-model="formData.passwort" min="7">
            </div>
            <div class="col-auto">
              <label for="passwortHint" class="form-label  fw-bold">PasswordHint</label>
              <input type="text" class="form-control  w-auto border border-3 " id="passwortHint"
                     v-model="formData.passwortHint" min="2">
            </div>
          </div>
          <div class="mb-3  p-3 ">
            <button type="submit" class="btn btn-primary">
              Speichern
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import {ref, watch, defineEmits, defineProps} from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: false
  }
});

const initialForm = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  passwort: '',
  passwortHint: ''
};

// Initialize with a shallow copy
const formData = ref({...initialForm})

const resetForm = () => {
  // Simple and clean reset
  formData.value = {...initialForm}
}
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
        console.log(":new item", JSON.stringify(newItem));
        // Tiefenkopie erstellen, um Referenzen zu trennen
        formData.value = {...newItem};
        editing.value = true;
      } else {
        console.log("newItem");
        resetForm();
        editing.value = false;
      }
    },
    {immediate: true, deep: true}
)
</script>

<style scoped>

</style>