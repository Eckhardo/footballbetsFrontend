<template>
  <div class="card">
    <div class="card-header">
      Tippgemeinschaften
    </div>
    <div class="card-body">

      <button class="btn btn-warning btn-sm me-2" @click="createItem">Neu anlegen
      </button>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Beschreibung</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(community) in communities" :key="community.id">
          <td>{{ community.name }}</td>
          <td>{{ community.description }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editItem(community)">Ändern
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteItem( community)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';

defineProps({
  communities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit-item', 'create-item', 'delete-item']);


// Funktionen zum Auslösen der Emits
const createItem = () => {
  emit('create-item', {
    community: null,
    isVisible: true
  })
}
const editItem = (item) => {
  emit('edit-item', {
    community: item,
    isVisible: true
  })
}
const deleteItem = (item) => {
  emit('delete-item', { item})
}
</script>

<style scoped>

</style>