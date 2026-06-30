<template>
  <header>
    <div v-if="username !==null" class="button-container  mx-1 pt-2 ">
     Herzlich Willkommen {{ username }}

      <div class="center-group">
        <h5>Eckhards SportBets Application</h5>
      </div>
    </div>
    <div v-if="username ===null" class="button-container  mx-1 pt-2 ">
     &nbsp;   &nbsp;  &nbsp; Bitte einloggen

      <div class="center-group">
        <h5>SportBets App</h5>
      </div>
    </div>
  </header>
</template>

<script>
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import {mapState} from "pinia";

export default {
  name: 'AppHeader',

  data() {
    return {}
  },
  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compId: 'defaultCompetitionId'}),
  }
};
</script>

<style scoped>
.button-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* Left (empty), Center, Right */
  align-items: center;
  width: 100%;
  background-color: #dddddd;
  z-index: 1000;
}

.center-group {
  grid-column: 2; /* Forces this group to the center column */
  display: flex;
  gap: 10px;
}
.dropdown:hover {
  display: block;
}
</style>
