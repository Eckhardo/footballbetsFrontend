<!-- components/ErrorMessage.vue -->

<template>
  <div
      v-if="showAlert"
      class="alert alert-danger fade show"
      role="alert"
  >
    <p><strong>{{ error.errorDetails }}</strong></p>

  </div>

</template>
<script setup>
import {computed} from 'vue'

// Definiert die empfangenen Props
const props = defineProps({
  showAlert: {
    type: Boolean,
  },
  error: {
    type: Object,
    default: {}
  }
})
</script>

<style scoped>

</style>