<script>
import {useUmsInfoStore} from "../stores/umsInfoStore.js";

export default {
  name: "Logout",

  setup() {
    const umsInfoStore = useUmsInfoStore();
    return {umsInfoStore};
  },
  data() {
    return {
      message: null,
      umsInfo:null
    }
  },
  // Define logic and API interactions
  methods: {

     handleLogout() {
      this.umsInfo = this.umsInfoStore;
      this.message = ` Der Benutzer <b> ${this.umsInfo.username}</b> wird abgemeldet`;
      setTimeout(() => {
        this.clearUmsInfo(this.umsInfo);
        this.umsInfoStore.fillUmsInfoStore(this.umsInfo);
        this.message="";
        this.$router.push({name: 'Home'});
      }, 4000)

    },
    clearUmsInfo() {
      this.umsInfo = {};
      this.umsInfo.username = "";
      this.umsInfo.loggedIn = false;
      this.umsInfo.path = "info";
      this.umsInfo.invalidPath =false;
    }
  },
  mounted() {
    this.handleLogout();
  }
}
</script>

<template>
  <div class="card">
    <div v-html="message" class="card-header">

    </div>
    <div class="card-body"></div>
  </div>
</template>

<style scoped>

</style>