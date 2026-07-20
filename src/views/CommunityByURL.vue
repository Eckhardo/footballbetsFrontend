<template>
  <ul v-if="loggedIn">Wähle Tipprunde:
    <!-- v-for durchläuft das Array; :key ist zwingend erforderlich -->
    <li v-for="item in formData.itemList" :key="item.id">
      <router-link :to="{ name: 'SelectedCommMemb', params: { commName: item.name } }">
       {{ item.name }}
      </router-link>
    </li>
  </ul>
</template>


<script setup>

import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {useError} from '@/composables/useError';
import {useMessage} from '@/composables/useMessage';
import {saveMessage} from "@/util/errorMessages.js";
import CommMembDataService from "@/service/community/CommMembDataService.js";
// Routen-Informationen holen
const route = useRoute();

const {setMessage} = useMessage();
const {setError} = useError();
// Reactive states
// Instantiate the global store
const umsInfoStore = useUmsInfoStore();
const {loggedIn,username} = storeToRefs(umsInfoStore);
const {setCommId} = umsInfoStore;
const formData = ref({
  itemList: [],
  selectedItem: null

});
const retrieveCommunity = async () => {
  console.info("retrieveCommunity() by username: ",username.value);
  try {
    const response = await CommMembDataService.getCommunities(username.value);
    if (response.status === 200) {
      console.log(":", response.status);
      formData.value.itemList = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const handleSubmit = async () => {
  try {
    setCommId(formData.value.community.id);
       if (response.status === 200) {
        setMessage("Eintrag geändert");
      }

  } catch (err) {
    console.error("ERROR update item", err);
    setError(saveMessage(err));
  }
}
onMounted(() => {
  retrieveCommunity();
})
</script>

<style scoped>

</style>