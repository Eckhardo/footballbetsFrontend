<template>
  <aside class="side-menu" id="competition">
    <nav>
      <ul v-if="compAdmin">

        <li><router-link to="/comp//defaultCompForm">Standards setzen</router-link></li>
        <li><router-link to="/comp/compFamilies">Sport-Events</router-link></li>
        <li><router-link to="/comp/comps">Wettbewerbe</router-link></li>
        <li><router-link to="/comp/compRounds">Runden</router-link></li>
        <li><router-link to="/comp/matchdays">Spieltage</router-link></li>
        <li><router-link to="/comp/matches">Spiele</router-link></li>
        <li><router-link to="/comp/compTableList">Tabelle</router-link></li>
        <li><router-link to="/comp/compTeams">Teams des Wettbewerbs</router-link></li>
        <li><router-link to="/comp/teams">Teams</router-link></li>
      </ul>

    </nav>
  </aside>
</template>

<script>
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

export default {
  name: 'CompAdminMenu',
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
  top: 350px; /* Below the header */
  left: 0;
  bottom: 0;
  overflow-y: auto;
  padding-top: 0;
  z-index:3;
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