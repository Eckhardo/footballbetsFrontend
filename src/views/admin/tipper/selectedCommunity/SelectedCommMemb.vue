<template>
  {{ formData.communityNotFound }}
  <div style="color: #5a0ce8" v-html=" errorMessage" v-if="formData.communityNotFound===true"></div>
  <div v-if="loggedIn" class="bets-container">
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
      <form @submit.prevent>
        <h5>Meine TippModi</h5>
        <table class="table table-striped table-hover">
          <thead>
          <tr>
            <th>Typ</th>
            <th>Name</th>
            <th>Deadline</th>
            <th v-if="formData.tippModusType==='ResultTipp'">Tendenz Punkte</th>
            <th v-if="formData.tippModusType==='ResultTipp'">Bonus Punkte</th>
            <th v-if="formData.tippModusType==='PointTipp'">Gesamte Punkte</th>
            <th>Aktion</th>
          </tr>
          </thead>
          <tbody>

          <tr v-for="(item) in formData.tippModi" :key="item.id">
            <td>
              <input type="text" class="form-control  w-auto border border-3 " id="name"
                     v-model="item.type"
                     readonly>
            </td>
            <td><input type="text" required class="form-control  w-auto border border-3 " id="name"
                       v-model="item.name"
            ></td>
            <td><input type="number" class="form-control  w-auto border border-3 " id="deadline"
                       v-model="item.deadline" min="0"></td>
            <td v-if="item.type==='ResultTipp'">{{ item.tendencyPoints }}</td>

            <td v-if="item.type==='ResultTipp'">{{ item.bonusPoints }}</td>

            <td v-if="item.type==='PointTipp'">{{ item.totalPoints }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" @click="changeItem( item)">Ändern</button>
            </td>
          </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
</template>
<script setup>
import {onMounted, defineProps, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import CommunityDataService from "@/service/community/CommunityDataService.js";
import CommMembDataService from "@/service/community/CommMembDataService.js";
import {useError} from '@/composables/useError.js';
import {saveMessage} from "@/util/errorMessages.js";
import TippModusDataService from "@/service/community/TippModusDataService.js";
import CompMembDataService from "@/service/competition/CompMembDataService.js";

// 2. Access the current path string (e.g., "/Bulitipper")
const umsInfoStore = useUmsInfoStore();
const {loggedIn} = storeToRefs(umsInfoStore);
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
      tippModi: [],
      tippModusType: null,
      communityNotFound: false
    }
)

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

const retrieveCompetition = async () => {

  console.info("retrieveCompetition()", formData.value.community.id);
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
      formData.value.tippModi = response.data;
      if (formData.value.tippModi.length > 0) {
        formData.value.tippModusType = formData.value.tippModi[0].type;
      }
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
const deleteItem = (item) => {
  console.info("deleteItem()", item.name);
}
const changeItem = (item) => {
  console.info("changeItem()", item.name);
  let name = item.name;

  if (!name) {
    handleError('Name is required');
    return;
  }
  console.log('add modus:', JSON.stringify(item));

  let index = formData.value.tippModi.findIndex(modus => modus.name === name);
  if (index !== -1) {
    formData.value.tippModi.splice(index, 1);
  }
  formData.value.tippModi.push(item);

}

const handleError = (message) => {
  const error = {
    response: {
      data: {
        detail: message
      }
    }
  }
  setError(saveMessage(error));
}

onMounted(async () => {
  console.log("onMounted()");
  await retrieveCommunity();
  if (loggedIn.value) {
    formData.value.communityNotFound = false;
    await retrieveCompetition();
    await retrieveTippModi();
    await retrieveTippers();
  }
})
</script>

<style scoped>
.bets-container {
  max-width: 850px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

</style>