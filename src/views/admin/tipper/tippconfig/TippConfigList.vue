
<template>
  <div class="card">
    <div class="card-header">
      TippModi für Spieltag
    </div>
    <div class="card-body">

      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Wettbewerb</th>
          <th>Runde</th>
          <th>Spieltag</th>
          <th>TippModus</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item) in items" :key="item.id">
          <td>{{ item.competitionName }}</td>
          <td>{{ item.roundName }}</td>
          <td>{{ item.spieltagNumber }}</td>
          <td>{{ item.tippModusName }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editItem(item)">Ändern
            </button>
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

const emit = defineEmits(['edit-item']);

const editItem = (item) => {
  emit('edit-item', {
    item: item,
    isVisible: true
  })
}
</script>

<style scoped>

</style>