<!-- ListItem.vue -->
<script setup>
import {defineProps, defineEmits} from 'vue';

// Define the data properties the component expects
defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Define actions that this component can trigger
const emit = defineEmits(['select', 'delete'])
</script>

<template>
  <li class="list-item">
    <!-- Flexible content styling -->
    <div class="item-content" @click="emit('select', item)">
      <!-- Scoped slot allows parent components to customize text layout -->
      <slot :item="item">
        <p class="title">{{ item.title || item.name }}</p>
      </slot>
    </div>

    <!-- Action element -->
    <button class="delete-btn" @click.stop="emit('delete', item.id)">
      Delete
    </button>
  </li>
</template>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}
.item-content {
  flex: 1;
  cursor: pointer;
}
.title {
  margin: 0;
  font-weight: 500;
}
</style>
