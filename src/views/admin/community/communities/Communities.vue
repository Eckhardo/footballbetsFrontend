<template>
  <div v-if="loggedIn" class="container mt-5">
    <!--  Form for Create/Update -->
    <CommForm v-if="isVisible" v-bind:current-community="editingCommunity" @save-community="handleSave"/>

    <!--  List for Read/Delete/Edit -->
    <CommList v-if="! isVisible" v-bind:communities="communities" @create-community="handleCreate"
              @edit-community="handleEdit"
              @delete-community="handleDelete"/>
  </div>
</template>


<script setup>
import {ref, onMounted} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

import CommunityDataService from "@/service/community/CommunityDataService.js";
import CommForm from "./CommForm.vue";
import CommList from "./CommList.vue";
import {useError} from '@/composables/useError';
import {useMessage} from '@/composables/useMessage';
import {saveMessage} from "@/util/errorMessages.js";
const {setMessage} = useMessage();
const {setError} = useError();
// Reactive states
// Instantiate the global store
const umsInfoStore = useUmsInfoStore();
const {loggedIn} = storeToRefs(umsInfoStore)
const communities = ref(null);
const editingCommunity = ref(null);
const isVisible = ref(false);


const handleSave = (payload) => {
  console.log("handleSave", JSON.stringify(payload));
}

const handleCreate = (payload) => {
  console.log("handleCreate", JSON.stringify(payload));
  // Set the community to be edited in the form
  editingCommunity.value = null;
  isVisible.value = payload.isVisible// Create a copy to prevent direct mutation
}

const handleEdit = (payload) => {
  console.log("handleEdit", JSON.stringify(payload));
}

const handleDelete = (payload) => {
  console.log("handleDelete", JSON.stringify(payload));
}
const fetchCommunities = async () => {
  try {
    const response = await CommunityDataService.getAll();
    console.log("data ", JSON.stringify(response.data));
    communities.value = response.data;
    isVisible.value = false;
    console.log("isVisible.value ", isVisible.value);
    setMessage("Communities found");
    console.log("ende ");
  } catch (err) {
    console.error("ERROR retrieve communities", JSON.stringify(err));
    setError(saveMessage(err));
  }
}

onMounted(() => {
  fetchCommunities();
})
</script>
<style scoped>

</style>