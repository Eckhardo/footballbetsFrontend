<script setup>

import {defineProps, onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

const umsInfoStore = useUmsInfoStore();
const {defaultCompetitionId, loggedIn} = storeToRefs(umsInfoStore);
const props = defineProps({
  commName: {
    type: String,
    required: true
  }
})


onMounted(() => {
  // Use the name to fetch specific community data from your API
  console.log(`Loading data for community: ${props.commName}`)
})

</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome to {{ commName }}</h1>
    <h1>comp to {{ defaultCompetitionId }}</h1>
  </div>
</template>

<style scoped>

</style>