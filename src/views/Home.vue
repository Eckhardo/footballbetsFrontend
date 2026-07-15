<!-- UserProfile.vue -->
<template>
  <div>
    <h2>Tippspiele zur Bundesliga, WM, EM und mehr</h2>

    <p>Starte jetzt Dein kostenloses Tippspiel mit Freunden oder Kollegen.</p>
  </div>
</template>

<script>
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {mapState} from 'pinia';

export default {
  name: 'Home',
  setup() {

    const umsInfoStore = useUmsInfoStore();
    umsInfoStore.f
    return {umsInfoStore};
  },
  mounted() {
    console.log("Home mounted.");
    this.clearUmsInfo(this.umsInfo);
    this.umsInfoStore.fillUmsInfoStore(this.umsInfo);
  },

  methods: {
    // mapActions maps store actions to local component methods
    clearUmsInfo() {
      this.umsInfo = {};
      this.umsInfo.username = "";
      this.umsInfo.loggedIn = false;
      this.umsInfo.path = "info";
      this.umsInfo.invalidPath =false;
    }

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