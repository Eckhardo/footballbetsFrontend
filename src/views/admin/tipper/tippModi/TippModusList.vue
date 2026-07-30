
<template>
  <div v-if="items.length>0" class="bets-container">
    <div style="padding-bottom:inherit ">
      <button type="button" class="btn btn-primary btn-sm me-2" @click="createItem">
        TippModus neu anlegen
      </button>
    </div>
    <h5>Meine TippModi</h5>
    <table class="table table-striped table-hover">
      <thead>
      <tr>
        <th>Typ</th>
        <th>Name</th>
        <th>Deadline</th>
        <th v-if="type==='ResultTipp'">Tendenz Punkte</th>
        <th v-if="type==='ResultTipp'">Bonus Punkte</th>
        <th v-if="type==='PointTipp'">Gesamte Punkte</th>
        <th>Aktion</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item) in items" :key="item.id">
        <td> {{ item.type }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.deadline }}</td>
        <td v-if="item.type==='ResultTipp'">{{ item.tendencyPoints }}</td>
        <td v-if="item.type==='ResultTipp'">{{ item.bonusPoints }}</td>
        <td v-if="item.type==='PointTipp'">{{ item.totalPoints }}</td>
        <td>
          <button :disabled="isListEmpty" class="btn btn-warning btn-sm me-2" @click="editItem( item)">Ändern</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

</template>
<script setup>
import {defineEmits, defineProps,computed,toRef} from 'vue';
const props=defineProps({
  items: {
    type: Array,
    default: () => []
  },
  type:{
    type: String,
    required: true
  }
})
const itemsRef = toRef(props, 'items')
const emit = defineEmits(['edit-item', 'create-item']);
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

const isListEmpty = computed(() => itemsRef.length === 0);

</script>

<style scoped>

</style>