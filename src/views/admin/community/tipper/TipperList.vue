<template>
  <div class="card">
    <div class="card-header">
      Tipper
    </div>
    <div class="card-body">

      <button class="btn btn-warning btn-sm me-2" @click="createItem">Neu anlegen
      </button>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Vorname</th>
          <th>Nachname</th>
          <th>Benutzername</th>
          <th>Email</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item) in items" :key="item.id">
          <td>{{ item.firstname }}</td>
          <td>{{ item.lastname }}</td>
          <td>{{ item.username }}</td>
          <td>{{ item.email }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editItem(item)">Ändern
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteItem( item)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script setup>
import {defineEmits, defineProps} from 'vue';

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit-item', 'create-item', 'delete-item']);


// Funktionen zum Auslösen der Emits
const createItem = () => {
  emit('create-item', {
    item: null,
    isVisible: true
  })
}
const editItem = (item) => {
  emit('edit-item', {
    item: item,
    isVisible: true
  })
}
const deleteItem = (item) => {
  emit('delete-item', { item})
}
</script>

<style scoped>

</style>