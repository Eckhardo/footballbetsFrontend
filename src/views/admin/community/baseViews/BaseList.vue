<!-- BaseList.vue -->
<script setup>
import {defineProps, defineEmits} from 'vue';
import ListItem from './ListItem.vue'

defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['item-click', 'item-delete'])
</script>

<template>
  <ul class="base-list">
    <!-- Always use a unique id for the key attribute -->
    <ListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @select="(val) => emit('item-click', val)"
        @delete="(id) => emit('item-delete', id)"
    >
      <!-- Forwarding slot allows the ultimate consumer to change content look -->
      <template #default="{ item: slotItem }">
        <slot :item="slotItem" />
      </template>
    </ListItem>
  </ul>
</template>

<style scoped>
.base-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
