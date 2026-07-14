<template>

  <div style="color: #5a0ce8" v-html=" errorMessage" v-if="formData.communityNotFound===true">
  </div>
  <div v-else>{{ formData.community }}</div>
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
          <th>Tendenz Punkte</th>
          <th>Bonus Punkte</th>
          <th>Gesamte Punkte</th>
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

          <td>
            <button class="btn btn-danger btn-sm" @click="deleteItem( item)">Löschen</button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>
<script setup>
import {useRoute, useRouter} from 'vue-router';
import {computed, onMounted, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import CommunityDataService from "@/service/community/CommunityDataService.js";
import CommMembDataService from "@/service/community/CommMembDataService.js";
import {useError} from '@/composables/useError.js';
import {useMessage} from '@/composables/useMessage.js';
import {saveMessage} from "@/util/errorMessages.js";
import TippModusDataService from "@/service/community/TippModusDataService.js";
import CompMembDataService from "@/service/competition/CompMembDataService.js";

// 2. Access the current path string (e.g., "/Bulitipper")
const umsInfoStore = useUmsInfoStore();
const {defaultCommunityId, defaultCompetitionId, loggedIn} = storeToRefs(umsInfoStore);
const props = defineProps({
  commName: {
    type: String,
    required: true
  }
})

let errorMessage = `<p>Die Tipprunde mit dem Kurznamen <b>${props.commName}</b> wurde nicht gefunden</p>
<p>Das kann folgende Ursachen haben:</p>
Der Link zur Tipprunde wurde falsch eingetippt. Bitte überprüfen Sie die Schreibweise.`;
const {setError} = useError();


const formData = ref(
    {
      community: null,
      competition: null,
      tippers: [],
      tippModusTypes: [],
      communityNotFound: false
    }
)

const retrieveCompetition = async () => {

  console.info("retrieveCompetition()",formData.value.community.id);
  try {
    const response = await CompMembDataService.findCurrentCompetition(formData.value.community.id);
    if (response.status === 200) {
      formData.value.competition = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const retrieveCommunity = async () => {
  console.info("retrieveCommunity()", props.commName);

  try {
    const response = await CommunityDataService.getByName(props.commName);
    if (response.status === 200) {
      formData.value.community = response.data;
      console.info(" formData.value.community::", formData.value.community.id);
      umsInfoStore.setPath(props.commName);
      umsInfoStore.setInvalidPath(false);
    } else {
      formData.value.communityNotFound = true;
      umsInfoStore.setPath(null);
      umsInfoStore.setInvalidPath(true);
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));

  }
}

const retrieveTippers = async () => {
  console.info("retrieveTippers()", formData.value.community.id);
  try {
    const response = await CommMembDataService.getTippers(formData.value.community.id);
    if (response.status === 200) {
      formData.value.tippers = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
const retrieveTippModi = async () => {
  console.info("retrieveTippModi()", formData.value.community.id);
  try {
    const response = await TippModusDataService.getModiForCommunity(formData.value.community.id);
    if (response.status === 200) {
      formData.value.tippModusTypes = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
onMounted(async () => {
  console.log("onMounted()");
  await retrieveCommunity();
  if (loggedIn.value) {
    await retrieveCompetition();
    await retrieveTippModi();
    await retrieveTippers();
  }

})
</script>

<style scoped>

</style>