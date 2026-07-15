<!-- steps/LastStepConfirmation.vue -->
<script setup>
import {defineModel} from 'vue';

const model = defineModel({type: Object, required: true});
</script>

<template>
  <div class="step-content">
    <h3>Step 3: Review Details</h3>
    <div class="summary-card">
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Tippgemeinschaft</th>
          <th>Beschreibung</th>
          <th>Gebuchter Wettbewerb</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td> {{ model.name }}</td>
          <td>{{  model.description }}</td>
          <td>{{  model.competition.name}}</td>
        </tr>
        </tbody>
      </table>
        <p><strong>Teilnehmer:</strong> <span v-for="(item, index) in model.tippers[1]" :key="index">
    {{ item.username }}<span v-if="index < model.tippers[1].length - 1">, </span></span></p>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>TippModus Typ</th>
          <th>TippModus Name</th>
          <th>Deadline</th>
          <th v-if="model.selectedTippModus.type==='ResultTipp'">Tendenz Punkte</th>
          <th v-if="model.selectedTippModus.type==='ResultTipp'">Bonus Punkte</th>
          <th v-if="model.selectedTippModus.type==='PointTipp'">Gesamte Punkte</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item) in model.selectedTippModi" :key="item.id">
          <td> {{ item.type }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.deadline }}</td>
          <td v-if="item.type==='ResultTipp'">{{ item.tendencyPoints }}</td>
          <td v-if="item.type==='ResultTipp'">{{ item.bonusPoints }}</td>
          <td v-if="item.type==='PointTipp'">{{ item.totalPoints }}</td>
        </tr>
        </tbody>
      </table> </div>
  </div>
</template>
