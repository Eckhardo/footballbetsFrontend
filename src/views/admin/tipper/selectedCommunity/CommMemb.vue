<template>
  <p>Static Path: {{ currentPath }}</p>
  <div v-if="loggedIn" class="card">
    <div class="card-header">
      <h4 style="text-align: center"><span
          v-if="formData.community !==null">Tippgemeinschaft {{ formData.community.name }}</span></h4>
      <h4 style="text-align: center"><span
          v-if="formData.competition !==null">Gebuchter Wettbewerb: {{ formData.competition.name }}</span></h4>
    </div>
    <div class="card-body">
      <h5>Mitglieder:</h5>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Benutzername</th>
          <th>Email</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(tipper) in formData.tippers" :key="tipper.id">
          <td>{{ tipper.username }}</td>
          <td>{{ tipper.email }}</td>
        </tr>
        </tbody>
      </table>

    </div>
    <div class="card-body">
      <h5>TippModi:</h5>
      <h5>Meine TippModi</h5>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Typ</th>
          <th>Name</th>
          <th>Deadline</th>
          <th >Tendenz Punkte</th>
          <th>Bonus Punkte</th>
          <th >Gesamte Punkte</th>
          <th>Aktion</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item) in formData.tippModusTypes" :key="item.id">
          <td> {{ item.type }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.deadline }}</td>
          <td v-if="item.type==='ResultTipp'">{{ item.tendencyPoints }}</td>
          <td v-else>n/a</td>
          <td v-if="item.type==='ResultTipp'">{{ item.bonusPoints }}</td>
          <td v-else>n/a</td>
          <td v-if="item.type==='PointTipp'">{{ item.totalPoints }}</td>
          <td v-else>n/a</td>

          <td><button class="btn btn-danger btn-sm" @click="deleteItem( item)">Löschen</button></td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>
<script setup>
import {useRoute} from 'vue-router';
import {computed, onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

const umsInfoStore = useUmsInfoStore();
const {defaultCommunityId, defaultCompetitionId, loggedIn} = storeToRefs(umsInfoStore);

import CommunityDataService from "@/service/community/CommunityDataService.js";
import CommMembDataService from "@/service/community/CommMembDataService.js";
import {useError} from '@/composables/useError.js';
import {useMessage} from '@/composables/useMessage.js';
import {saveMessage} from "@/util/errorMessages.js";
import CompDataService from "@/service/competition/CompDataService.js";
import TippModusDataService from "@/service/community/TippModusDataService.js";


const {setMessage} = useMessage();
const {setError} = useError();
// Routen-Informationen holen
const route = useRoute();

// 2. Access the current path string (e.g., "/Bulitipper")
const currentPath = route.path;
// Zugriff auf den Parameter ':id' aus dem Pfad (/target/123)
const commId = computed(() => route.params.commId || defaultCommunityId.value);
const compId = computed(() => route.params.compId || defaultCompetitionId.value);
const formData = ref(
    {
      community: null,
      competition: null,
      tippers: [],
      tippModusTypes:[]
    }
)

const retrieveCompetition = async () => {
  console.info("retrieveCompetition()", compId.value);
  try {
    const response = await CompDataService.get(compId.value);
    if (response.status === 200) {
      formData.value.competition = response.data;

    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const retrieveCommunity = async () => {
  console.info("retrieveCommunity()", commId.value);
  try {
    const response = await CommunityDataService.get(commId.value);
    if (response.status === 200) {
      formData.value.community = response.data;

    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const retrieveTippers = async () => {
  console.info("retrieveTippers()", commId.value);
  try {
    const response = await CommMembDataService.getTippers(commId.value);
    if (response.status === 200) {
      formData.value.tippers = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
const retrieveTippModi = async () => {
  console.info("retrieveTippModi()", commId.value);
  try {
    const response = await TippModusDataService.getModiForCommunity(commId.value);
    if (response.status === 200) {
      formData.value.tippModusTypes = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
onMounted(() => {
  console.log("onMounted()");
  if (loggedIn.value) {
    retrieveCompetition();
    retrieveCommunity();
    retrieveTippModi();
    retrieveTippers();
  }

})
</script>

<style scoped>

</style>