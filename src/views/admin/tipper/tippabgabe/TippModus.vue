<script setup>
import {defineEmits, defineProps,computed,toRef} from 'vue';
const props=defineProps({
  item: {
    type: Object,
   required: true
  }
})
</script>

<template>
  <div class="datatable-container">
  <table class="table table-striped table-hover">
    <thead>
    <tr>
      <th>Typ</th>
      <th>Name</th>
      <th>Deadline</th>
      <th v-if="item.type==='ResultTipp'">Tendenz Punkte</th>
      <th v-if="item.type==='ResultTipp'">Bonus Punkte</th>
      <th v-if="item.type==='PointTipp'">Gesamte Punkte</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td> {{ item.type }}</td>
      <td>{{ item.name }}</td>
      <td>{{ item.deadline }}</td>
      <td v-if="item.type==='ResultTipp'">{{ item.tendencyPoints }}</td>
      <td v-if="item.type==='ResultTipp'">{{ item.bonusPoints }}</td>
      <td v-if="item.type==='PointTipp'">{{ item.totalPoints }}</td>
    </tr>
    </tbody>
  </table>
  </div>
</template>

<style scoped>

.datatable-container {
  font-family: sans-serif;
  margin: 20px auto;
  max-width:750px;
  position: relative;
}
</style>