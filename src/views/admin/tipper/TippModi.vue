<template>
  <div v-if="formData.tippModi.length>0 && loggedIn" class="card-body">

    <button type="button" class="btn btn-primary" @click="prepareCreate">
      TippModus neu anlegen
    </button>
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
        <td> {{ item.type }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.deadline }}</td>
        <td v-if="item.type==='ResultTipp'">{{ item.tendencyPoints }}</td>
        <td v-if="item.type==='ResultTipp'">{{ item.bonusPoints }}</td>
        <td v-if="item.type==='PointTipp'">{{ item.totalPoints }}</td>
        <td>
          <button :disabled="isListEmpty" class="btn btn-warning btn-sm me-2" @click="changeItem( item)">Ändern</button>
          <button :disabled="isListEmpty" class="btn btn-danger btn-sm" @click="deleteItem( item)">Löschen</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <div v-if="formData.selectedTippModus!==null" class="card-body">
    <h5>TippModus ändern</h5>

    <form @submit.prevent>
      <div class="row g-4 mb-3">
        <div class="col-auto">
          <label for="name" class="form-label  fw-bold">Type</label>
          <input type="text" class="form-control  w-auto border border-3 " id="name"
                 v-model="formData.selectedTippModus.type" readonly>
        </div>
        <div class="col-auto">
          <label for="name" class="form-label  fw-bold">Name</label>
          <input type="text" required class="form-control  w-auto border border-3 " id="name"
                 v-model="formData.selectedTippModus.name" placeholder="MyName"
          >
        </div>
        <div class="col-auto">
          <label for="deadline" class="form-label  fw-bold">Deadline (Minuten vor Spielbeginn)</label>
          <input type="number" class="form-control  w-auto border border-3 " id="deadline"
                 v-model="formData.selectedTippModus.deadline" min="0">
        </div>
        <div v-if="formData.selectedTippModus.type==='ResultTipp'" class="col-auto">
          <label for="tendencyPoints" class="form-label  fw-bold">Tendenz Punkte</label>
          <input type="number" class="form-control  w-auto border border-3 " id="tendencyPoints"
                 v-model="formData.selectedTippModus.tendencyPoints" min="1">
        </div>
        <div v-if="formData.selectedTippModus.type==='ResultTipp'" class="col-auto">
          <label for="bonusPoints" class="form-label  fw-bold">Bonus Punkte</label>
          <input type="number" class="form-control  w-auto border border-3 " id="bonusPoints"
                 v-model="formData.selectedTippModus.bonusPoints" min="0">
        </div>

        <div v-if="formData.selectedTippModus.type==='PointTipp'" class="col-auto">
          <label for="totalPoints" class="form-label  fw-bold">Gesamte Punkte</label>
          <input type="number" class="form-control  w-auto border border-3 " id="totalPoints"
                 v-model="formData.selectedTippModus.totalPoints" min="1">
        </div>
      </div>
      <div v-if="isUpdate===false" class="mb-3  p-3 ">
        <button type="button" class="btn btn-primary" @click="handleAdd">
          TippModus hinzufügen
        </button>
      </div>
      <div v-else class="mb-3  p-3 ">
        <button type="button" class="btn btn-primary" @click="handleUpdate">
          TippModus ändern
        </button>
      </div>
    </form>
  </div>

</template>

<script setup>
import {storeToRefs} from "pinia";
import {computed, ref, onMounted} from 'vue';
import {useError} from '@/composables/useError.js';
import {saveMessage} from "@/util/errorMessages.js";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import CommunityDataService from "@/service/community/CommunityDataService.js";
import TippModusDataService from "../../../service/tipps/TippModusDataService.js";
import TipperDataService from "../../../service/community/TipperDataService.js";
import {useMessage} from "../../../composables/useMessage.js";


const isUpdate = ref(false);
const {setError} = useError();
const {setMessage}=useMessage();
const umsInfoStore = useUmsInfoStore();
const {loggedIn, path} = storeToRefs(umsInfoStore);

const formData = ref(
    {
      community: null,
      tippModi: [],
      selectedTippModus: null,
      tippModusType: null,
    }
)

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
const save = async () => {
  console.info("saveTippModus()", formData.value.selectedTippModus.name);
  try {
    const response = await TippModusDataService.create( formData.value.selectedTippModus);
    if (response.status === 201) {
      formData.value.selectedTippModus = response.data;
    }
    await retrieveTippModi();
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
const update = async () => {
  console.info("updateTippModus()", formData.value.selectedTippModus.name);
  try {
    const response = await TippModusDataService.update(formData.value.selectedTippModus.id, formData.value.selectedTippModus);
    if (response.status === 200) {
      formData.value.selectedTippModus = response.data;
    }
    await retrieveTippModi();
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}


const handleDelete = (item) => {

  if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
    // If the user confirms, proceed with the deletion logic
    confirmDelete(item);
  }
}
const confirmDelete = async (item) => {

  try {
    console.log("confirmDelete", JSON.stringify(item));
    const response = await TippModusDataService.delete(item.id);
    if (response.status === 204) {
      await retrieveTippModi();
      setMessage("Eintrag gelöscht");
    }
  } catch (err) {
    console.error("ERROR delete item", err.message);
    setError(saveMessage(err));
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
        formData.value.selectedTippModus=null;
      }
    }
  } catch (e) {
    console.error(e);
    setError(saveMessage(e));
  }
}
const prepareCreate= ()=>{
  const newItem= {...formData.value.tippModi[0]};
  newItem.name="NewModus";
  newItem.deadline=0;
  formData.value.selectedTippModus = newItem;
}
const handleAdd = () => {
  const copy = {...formData.value.selectedTippModus};
  if (!copy.name) {
    handleError('Name is required');
    return;
  }
  if (isDuplicate(copy.name)) {
    handleError('Name is not unique');
    return;
  }
   save();
}

const handleUpdate = () => {
  const copy = {...formData.value.selectedTippModus};
  let name = copy.name;

  if (!name) {
    handleError('Name is required');
    return;
  }
  if (isDuplicate(copy.name)) {
    handleError('Name is not unique');
    return;
  }
  update();
}
const deleteItem = (item) => {
  handleDelete(item);

}
const changeItem = (item) => {
  const copy = {...item};
  let name = copy.name;
  formData.value.selectedTippModus = formData.value.tippModi.find(modus => modus.name === name);
  isUpdate.value = true;
}

const isListEmpty = computed(() => formData.value.tippModi.length === 0);


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

const isDuplicate = (name) => {
  for (const modus in formData.value.tippModi) {
    if (modus.name === name) {
      return true;
    }
  }
  return false;
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
</style>