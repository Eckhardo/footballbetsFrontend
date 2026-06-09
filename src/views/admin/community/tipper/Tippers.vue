<template>
  <div v-if="loggedIn" class="container mt-5">
    <!--  Form for Create/Update -->
    <TipperForm v-if="isVisible" v-bind:item="editingItem" @save-item="handleSave"/>

    <!--  List for Read/Delete/Edit -->
    <TipperList v-if="! isVisible" v-bind:items="tippers" @create-item="handleCreate"
                @edit-item="handleEdit"
                @delete-item="handleDelete"/>
  </div>
</template>


<script setup>
import {onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

import {useError} from '@/composables/useError';
import {useMessage} from '@/composables/useMessage';
import {saveMessage} from "@/util/errorMessages.js";
import TipperForm from "./TipperForm.vue";
import TipperList from "./TipperList.vue";
import TipperDataService from "../../../../service/community/TipperDataService.js";

const tippers = ref(null);
const editingItem = ref(null);
const isVisible = ref(false);
const {setMessage} = useMessage();
const {setError} = useError();
// Reactive states
// Instantiate the global store
const umsInfoStore = useUmsInfoStore();
const {loggedIn} = storeToRefs(umsInfoStore)


const handleSave = async (payload) => {
  console.log("handleSave", JSON.stringify(payload));

  isVisible.value = false;
  if (payload.id) {
    try {
      const response = await TipperDataService.update(payload.id, payload);
      if (response.status === 200) {
        setMessage("Eintrag geändert");
        await fetchTippers();
      }
    } catch (err) {
      console.error("ERROR update item", err);
      setError(saveMessage(err));
    }
  } else {
    {
      try {
        const response = await TipperDataService.create(payload);
        if (response.status === 201) {
          await fetchTippers();
          setMessage("Eintrag gespeichert");

        }
      } catch (err) {
        console.error("ERROR create item");
        setError(saveMessage(err));

      }
    }
  }
  editingItem.value = null;
}

const handleCreate = (payload) => {
  console.log("handleCreate", JSON.stringify(payload));
  // Set the community to be edited in the form
  editingItem.value = null;
  isVisible.value = payload.isVisible// Create a copy to prevent direct mutation
}

const handleEdit = (payload) => {
  console.log("handleEdit", JSON.stringify(payload));
  editingItem.value = {...payload.item};
  isVisible.value = payload.isVisible;
}

const handleDelete = (payload) => {
  console.log("handleDelete", JSON.stringify(payload));
  if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
    // If the user confirms, proceed with the deletion logic
    confirmDelete(payload.item);
  }
}
const confirmDelete = async (item) => {

  try {
    console.log("confirmDelete", JSON.stringify(item));
    const response= await TipperDataService.delete(item.id);
    if (response.status === 204) {
      await fetchTippers();
      setMessage("Eintrag gelöscht");
    }
  } catch (err) {
    console.error("ERROR delete item", err.message);
    setError(saveMessage(err));
  }

}
const fetchTippers = async () => {
  try {
    const response = await TipperDataService.getAll();
    console.log("data ", JSON.stringify(response.data));
    tippers.value = response.data;
    isVisible.value = false;
    console.log("isVisible.value ", isVisible.value);

  } catch (err) {
    console.error("ERROR retrieve items", JSON.stringify(err));
    setError(saveMessage(err));
  }
}

onMounted(() => {
  fetchTippers();
})
</script>
<style scoped>

</style>