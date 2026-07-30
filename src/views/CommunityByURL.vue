<template>
  <div class="bets-container">
    <h5>Wähle Tipprunde:</h5>
  <ul v-if="loggedIn">
    <!-- v-for durchläuft das Array; :key ist zwingend erforderlich -->
    <li v-for="item in formData.itemList" :key="item.id">
      <router-link :to="{ name: 'SelectedCommMemb', params: { commName: item.name } }">
       {{ item.name }}
      </router-link>
    </li>
  </ul>
  </div>
</template>


<script setup>

import {onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {useError} from '@/composables/useError';
import {saveMessage} from "@/util/errorMessages.js";
import CommMembDataService from "@/service/community/CommMembDataService.js";

const {setError} = useError();
// Reactive states
// Instantiate the global store
const umsInfoStore = useUmsInfoStore();
const {loggedIn,username} = storeToRefs(umsInfoStore);
const formData = ref({
  itemList: [],
  selectedItem: null

});
const retrieveCommunity = async () => {
   try {
    const response = await CommMembDataService.getCommunities(username.value);
    if (response.status === 200) {
      formData.value.itemList = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
onMounted(() => {
  retrieveCommunity();
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