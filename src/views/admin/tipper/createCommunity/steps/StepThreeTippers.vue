<!-- steps/StepThreeTippers.vue -->
<script setup>
import {defineModel} from 'vue';
import PickList from 'primevue/picklist';

const model = defineModel({type: Object, required: true});
const handleCompChange = (event) => {

  console.log('Native event target value:', event.target.value)

}
</script>

<template>
  <div class="card-body">
    <h3>Step 3: Tipp-Mitglieder</h3>
    <div class="row g-4 mb-3">
      <PickList v-model="model.tippers" dataKey="id" breakpoint="1000px" listStyle="height:700px"
                :pt="{
                       sourceControls: { style: 'display: none' },
                       targetControls: { style: 'display: none' },
                       transferControls: { style: 'background-color:#89b4e6; padding:10px; ' },
                       sourceListContainer: { style: 'background-color: white' },
                       targetListContainer: { style: 'background-color:white ' },}"
      >
        <template #sourceheader><b style=" padding-left:10px;">Verfügbar:</b></template>
        <template #targetheader><b style=" padding-left:10px;">Ausgewählt:</b></template>
        <template #item="slotProps">
          <div class=" p-1 align-items-center gap-3">
            <span style=" padding-left:10px;" class="font-bold">{{ slotProps.item.username }}</span>
          </div>
        </template>
      </PickList>
    </div>
  </div>
</template>
