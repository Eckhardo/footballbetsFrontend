<template>

  <div v-if="loggedIn && loaded" class="container mt-5">
    <!--  Form for Update -->
    <TippConfigForm v-if="formData.isVisible"  v-bind:tippModi="formData.tippModi"
                    v-bind:item="formData.editingItem" @save-item="handleSave"/>
    <!--  List for Read/Edit -->
    <TippConfigList v-if="! formData.isVisible" v-bind:items="formData.tippConfigs" @edit-item="handleEdit"/>
  </div>
</template>


<script setup>
import {storeToRefs} from "pinia";
import { ref, onMounted} from 'vue';
import {useError} from '@/composables/useError.js';
import {saveMessage} from "@/util/errorMessages.js";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {useMessage} from "@/composables/useMessage.js";
import CommunityDataService from "@/service/community/CommunityDataService.js";
import CompMembDataService from "@/service/competition/CompMembDataService.js";
import TippConfigDataService from "@/service/tipps/TippConfigDataService.js";
import TippModusDataService from "@/service/tipps/TippModusDataService.js";
import TippConfigForm from "./TippConfigForm.vue";
import TippConfigList from "./TippConfigList.vue";

const {setError} = useError();
const {setMessage} = useMessage();
const umsInfoStore = useUmsInfoStore();
const {loggedIn, path} = storeToRefs(umsInfoStore);

const loaded= ref(false);
const formData = ref(
    {
      community: null,
      competition: null,
      compMemb: null,
      editingItem: null,
      tippConfigs: [],
      isVisible:false

    }
)
const retrieveCommunity = async () => {
  try {
    const response = await CommunityDataService.getByName(path.value);
    if (response.status === 200) {
      formData.value.community = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));

  }
}

const retrieveCompetition = async () => {
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

const retrieveCompMemb = async () => {
  try {
    const response = await CompMembDataService.findOne(formData.value.community.id, formData.value.competition.id);
    if (response.status === 200) {
      formData.value.compMemb = response.data;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
const retrieveTippModi = async () => {
  try {
    const response = await TippModusDataService.getModiForCommunity(formData.value.community.id);
    if (response.status === 200) {
      console.log(JSON.stringify(response.data));
      formData.value.tippModi = response.data;

      if (formData.value.tippModi.length > 0) {
        formData.value.tippModusType = formData.value.tippModi[0].type;
        formData.value.selectedTippModus = null;
      }
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
const retrieveTippConfigs = async () => {
  try {
    const response = await TippConfigDataService.getRowsForCompMemb(formData.value.compMemb.id);
    if (response.status === 200) {
      formData.value.tippConfigs = response.data;
      loaded.value = true;
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}



const handleSave = async (payload) => {
  formData.value.isVisible = false;
  if (payload.id) {
    try {
      const response = await TippConfigDataService.update(payload.id, payload);
      if (response.status === 200) {
        setMessage("Eintrag geändert");
        await retrieveTippConfigs();
      }
    } catch (err) {
      console.error("ERROR update item", err);
      setError(saveMessage(err));
    }
  }

 formData.value.editingItem = null;
}

const handleEdit = (payload) => {
   formData.value.editingItem = {...payload.item};
  formData.value.isVisible = payload.isVisible;
}

onMounted(async () => {
  await retrieveCommunity();
  if (loggedIn.value) {
    await retrieveCompetition();
    await retrieveCompMemb();
    await retrieveTippModi();
    await retrieveTippConfigs();
  }
})
</script>


<style scoped>

</style>