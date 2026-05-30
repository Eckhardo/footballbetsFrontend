<!-- components/GlobalErrorMessage.vue -->
<template>
  <Transition name="fade">
    <div v-if="isVisible" class="error-banner" role="alert">
      <span class="error-text">{{ message }}</span>
      <button @click="clearError" class="close-btn" aria-label="Schließen">&times;</button>
    </div>
  </Transition>
</template>

<script setup>
import { useError } from '@/composables/useError'

const { message, isVisible, clearError } = useError()
</script>

<style scoped>
.error-banner {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ef4444;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 9999;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
