<template>
  <aside class="side-menu">
    <nav>
      <ul>
        <li><router-link to="/community">Communities</router-link></li>
        <li><router-link to="/community/tests">Tests</router-link></li>
        <li><router-link to="/commMembs">CommMemb</router-link></li>
        <li><router-link to="/compMembs">CompMemb</router-link></li>
        <li><router-link to="/tippModi">TippModus</router-link></li>
      </ul>

    </nav>
  </aside>
</template>

<script>
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

export default {
  name: 'CommAdminMenu',
  data() {
    return {}
  },
  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compAdmin: 'compAdmin'}),
  },
};
</script>

<style scoped>
.side-menu {
  background-color: #f4f4f4;
  width: 200px; /* Fixed width for sidebar */
  position: fixed;
  top: 450px; /* Below the header */
  left: 0;
  bottom: 0;
  overflow-y: auto;
  padding-top: 0;
  z-index: 9;
}
ul {
  list-style-type: none;
  padding: 0;
}
li a {
  display: block;
  padding: 5px;
  text-decoration: none;
  color: #333;
}
li a.router-link-active {
  background-color: #ddd;
}
a {
  color: blue;
  text-decoration: none;
  transition: color 0.3s; /* Optional: Weicher Übergang */
}

/* Farbe beim Hover */
a:hover {
  color:  #89b4e6;
}

/* Farbe für den aktuell aktiven Link (automatisch von Vue Router) */
.router-link-active {
  font-weight: bold;
  color:#5a0ce8;
}
</style>