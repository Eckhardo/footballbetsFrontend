<template>
  <div class="card">
    <div class="card-header">
     <h4 style="text-align: center"><span v-if="formData.community !==null">Tippgemeinschaft {{formData.community.name}}</span>  </h4>
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
  </div>
</template>
<script setup>
import {useRoute} from 'vue-router';
import {computed, onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
const umsInfoStore = useUmsInfoStore();
const {defaultCommunityId, defaultCompetitionId, loggedIn} = storeToRefs(umsInfoStore);

import CommunityDataService from "@/service/community/CommunityDataService";
import CommMembDataService from "@/service/community/CommMembDataService";

import {useError} from '@/composables/useError';
import {useMessage} from '@/composables/useMessage';
import {saveMessage} from "@/util/errorMessages.js";
const {setMessage} = useMessage();
const {setError} = useError();
// Routen-Informationen holen
const route = useRoute();

// Zugriff auf den Parameter ':id' aus dem Pfad (/target/123)
const commId = computed(() => route.params.commId || defaultCommunityId.value);
const compId = computed(() => route.params.compId || defaultCompetitionId.value);
const formData = ref(
    {
      community: null,
      competitions: [],
      tippers: []
    }
)

const retrieveCommunity = async () => {
  try {
    const response = await CommunityDataService.get(commId.value);
    if (response.status === 200) {
      formData.value.community = response.data;
      await retrieveTippers();
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const retrieveTippers = async () => {
  console.info("retrieveTippers()", commId);
  try {
    const response = await CommMembDataService.getTippers(commId.value);
    if (response.status === 200) {
      setMessage("Abfrage erfolgreich");
      formData.value.tippers = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

onMounted(() => {
  console.info("onMounted()");
  retrieveCommunity();


})
</script>

<style scoped>

</style>