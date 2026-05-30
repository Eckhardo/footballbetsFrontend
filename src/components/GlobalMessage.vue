<!-- components/GlobalMessage.vue -->
<template>

  <Transition name="fade">
    <div v-if="isVisible" class="message-banner" role="alert">
      <span class="error-text">{{ message }}</span>
      <button @click="clearMessage" class="close-btn" aria-label="Schließen">&times;</button>
    </div>
  </Transition>
</template>

<script setup>
import {useMessage} from "../composables/useMessage.js";
const { message, isVisible, clearMessage } = useMessage();
</script>

<style scoped>
.message-banner {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: limegreen;
  color: black;
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
>