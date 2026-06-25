<template>
  <div class="target">
    <h1>Ziel-Komponente geladen!</h1>
    <p>Übergebene Comm Id: <strong>{{ commId }}</strong></p>
    <p>Übergebene Comp Id: <strong>{{ compId }}</strong></p>
    <p>Community: <strong>{{ formData.community }}</strong></p>
    <p>Tippers: <strong>{{ formData.tippers }}</strong></p>
  </div>
</template>
<script setup>
import {useRoute} from 'vue-router';
import {computed, onMounted, ref} from 'vue';
import CommunityDataService from "../../../../service/community/CommunityDataService";

import {useError} from '@/composables/useError';
import {useMessage} from '@/composables/useMessage';
import {saveMessage} from "@/util/errorMessages.js";
import CommMembDataService from "../../../../service/community/CommMembDataService";

const {setMessage} = useMessage();
const {setError} = useError();
// Routen-Informationen holen
const route = useRoute();

// Zugriff auf den Parameter ':id' aus dem Pfad (/target/123)
const commId = computed(() => route.params.commId);
const compId = computed(() => route.params.compId);
const formData = ref(
    {
      community: null,
      competitions: [],
      tippers: []
    }
)

const retrieveCommunity = async () => {
  console.info("retrieveCommunity()", commId);
  try {
    const response = await CommunityDataService.get(commId.value);
    if (response.status === 200) {
      console.log(response.status);
      setMessage("Abfrage erfolgreich");
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