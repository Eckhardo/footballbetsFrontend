<!-- UserProfile.vue -->
<template>
  <div v-if="umsInfo.loggedIn">
    <h2>Welcome, {{ username }}</h2>
  </div>
</template>

<script>
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {mapState} from 'pinia';

export default {
  name: 'Home',

  mounted() {
    console.log("Home mounted.");
  },
  computed: {

    ...mapState(useUmsInfoStore, ['umsInfo']),
  },
  methods: {
    // mapActions maps store actions to local component methods


  },
  // You can also access the store directly in any method

};
</script>
<style scoped>
.dropdown2 {
  position: relative;
  display: inline-block;
}

.dropdown-menu2 {
  list-style: none;
  padding: 10px;
  min-width: 150px;
  z-index: 100;

}
</style>