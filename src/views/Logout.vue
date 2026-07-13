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

    async handleLogout() {
      console.log("logout");
      this.umsInfo = this.umsInfoStore;
      this.clearUmsInfo(this.umsInfo);
      await this.umsInfoStore.fillUmsInfoStore(this.umsInfo);

      setTimeout(() => {
        this.message = ` <b> ${this.umsInfo.username}</b> abgemeldet`;
      }, 2000)
      this.$router.push({name: 'Home'})
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