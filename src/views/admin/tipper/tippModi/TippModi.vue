<template>
  <div v-if="loggedIn && loaded" class="container mt-5">
    <!--  Form for Update -->
    <TippModusForm v-if="formData.isVisible" v-bind:tippModusReference="tippModusReference"
                   v-bind:tippModi="formData.tippModi"
                   v-bind:item="formData.editingItem" @save-item="handleSave"/>
    <!--  List for Read/Edit -->
    <TippModusList v-if="! formData.isVisible" v-bind:type="formData.tippModusType" v-bind:items="formData.tippModi"
                   @create-item="handleCreate"
                   @edit-item="handleEdit"/>
  </div>


</template>

<script setup>
import {storeToRefs} from "pinia";
import {computed, ref, onMounted} from 'vue';
import {useError} from '@/composables/useError.js';
import {saveMessage} from "@/util/errorMessages.js";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import CommunityDataService from "@/service/community/CommunityDataService.js";
import TippModusDataService from "@/service/tipps/TippModusDataService.js";
import {useMessage} from "@/composables/useMessage.js";

import TippModusForm from "./TippModusForm.vue";
import TippModusList from "./TippModusList.vue";


const isUpdate = ref(false);
const {setError} = useError();
const {setMessage} = useMessage();
const umsInfoStore = useUmsInfoStore();
const {loggedIn, path} = storeToRefs(umsInfoStore);
const loaded = ref(false);
const tippModusReference=ref(null);
const formData = ref(
    {
      community: null,
      tippModi: [],
      editingItem: null,
      tippModusType: null,
      isVisible: false,
    }
)

const handleCreate = (payload) => {
  console.log("handleCreate", JSON.stringify(payload));
  // Set the community to be edited in the form
  formData.value.editingItem = null;
  formData.value.isVisible = payload.isVisible;
}

const handleEdit = (payload) => {
  console.log("handleEdit", JSON.stringify(payload));
  formData.value.editingItem = {...payload.item};
  formData.value.isVisible = payload.isVisible;
}

const retrieveCommunity = async () => {
  console.info("retrieveCommunity()", path.value);
  try {
    const response = await CommunityDataService.getByName(path.value);
    if (response.status === 200) {
      formData.value.community = response.data;
      console.info(" community id::", formData.value.community.id);
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));

  }
}
const handleSave = async (payload) => {

  if (!payload.name) {
    handleError('Name is required');
    formData.value.isVisible=true;
    return;
  }

  console.log("handleSave", JSON.stringify(payload));

  formData.value.isVisible = false;
  if (payload.id) {
    try {
      const response = await TippModusDataService.update(payload.id, payload);
      if (response.status === 200) {
        formData.value.selectedTippModus = response.data;
      }
      await retrieveTippModi();
    } catch (e) {
      console.error(e);
      setError(saveMessage(e));
    }
  } else {
    try {

      const response = await TippModusDataService.create(payload);
      if (response.status === 201) {
        formData.value.selectedTippModus = response.data;
      }
      await retrieveTippModi();
    } catch (e) {
      console.error(e);
      setError(saveMessage(e));
    }
  }
}

const retrieveTippModi = async () => {
  console.info("retrieveTippModi()", formData.value.community.id);
  try {
    const response = await TippModusDataService.getModiForCommunity(formData.value.community.id);
    if (response.status === 200) {
      console.log(JSON.stringify(response.data));
      formData.value.tippModi = response.data;

      if (formData.value.tippModi.length > 0) {
        formData.value.tippModusType = formData.value.tippModi[0].type;
       tippModusReference.value = formData.value.tippModi[0];
      }
      loaded.value = true;
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
    formData.value.communityNotFound = false;
    await retrieveTippModi();
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