<template>
  <div  class="card mb-4 ">
    <div class="card-header  fs-5 ">
      Tippgemeinschaft als Standard setzen
    </div>
    <div class="card-body ">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3  p-3 border rounded" v-if="formData.communities!=null">
          <div>
            <label for="compId" class="form-label  fw-bold">Tippgemeinschaften:</label>
            <!-- Use Bootstrap's form-select class for styling -->
            <select id="compId" class="form-select  w-auto border border-3 " v-model="formData.community"
                    @change="handleCommunityChange" required>
              <option v-for="comm in formData.communities" :value="comm" :key="comm.id">
                {{ comm.name }}
              </option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">
          Standard speichern
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {useError} from '@/composables/useError';
import {useMessage} from '@/composables/useMessage';
import {saveMessage} from "@/util/errorMessages.js";

import CommMembDataService from "@/service/community/CommMembDataService.js";
import CommunityDataService from "../../../../service/community/CommunityDataService.js";
import TipperDataService from "../../../../service/community/TipperDataService.js";

const {setMessage} = useMessage();
const {setError} = useError();
// Reactive states
// Instantiate the global store
const umsInfoStore = useUmsInfoStore();
const {loggedIn, username} = storeToRefs(umsInfoStore);
const {setCommId} = umsInfoStore;
const formData = ref({
  communities: [],
  community: null

});
const retrieveCommunities = async () => {
  console.info("retrieveCommunities()", username.value);
  try {
    const response = await CommMembDataService.getCommunities(username.value);
    if (response.status === 200) {
      setMessage("Abfrage erfolgreich");
      formData.value.communities = response.data;
      if (formData.value.communities.length > 0) {
        formData.value.community = formData.value.communities[0];
      }
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}

const handleSubmit = async () => {
  try {
    setCommId(formData.value.community.id);
    const tipperResponse = await TipperDataService.findByName(username.value);
    if (tipperResponse.status === 200) {
      console.info("200");

      const tipper = tipperResponse.data;
      console.info("retrieveCommunities()", JSON.stringify(tipper));
      tipper.defaultCommunityId = formData.value.community.id;
      const response = await TipperDataService.update(tipper.id, tipper);
      if (response.status === 200) {
        setMessage("Eintrag geändert");
      }
    }
  } catch (err) {
    console.error("ERROR update item", err);
    setError(saveMessage(err));
  }
}
onMounted(() => {
  retrieveCommunities();
})

</script>

<style scoped>

</style>