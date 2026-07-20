<template>
  <aside class="side-menu" id="tipper">
    <nav>
      <ul>
        <li v-if="umsInfoStore.loggedIn">
          <router-link to="/createCommunity">Tippgemeinschaft anlegen</router-link>
        </li>
        <li v-if="isVisible && umsInfoStore.loggedIn && umsInfoStore.path!=='info'">
          <router-link :to="{ name: 'SelectedCommMemb', params: { commName:getPath} }">Tippgemeinschaft</router-link>
        </li>
        <li v-if="isVisible && umsInfoStore.loggedIn && umsInfoStore.path!=='info'">
          <router-link to="/tippspielplan">Spielplan</router-link>
        </li>
        <hr style="border: none; border-top: 2px dotted black; width: 180px;">
      </ul>
    </nav>
  </aside>
</template>

<script>
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";

export default {
  name: 'CommAdminMenu',
  setup() {
    const umsInfoStore = useUmsInfoStore();
    return {umsInfoStore};
  },
  data() {
    return {
      isUsed: false,
      path: null
    }
  },
  computed: {
    getPath() {

      const path = this.umsInfoStore.path === null ? 'info' : this.umsInfoStore.path;
      console.log("my ^path:::", path);
      return path;
    }
  },

  methods: {
    isVisible() {
      return this.umsInfo.tipperCommunities.includes(this.umsInfo.defaultCommunityId);
    }
  }
};
</script>

<style scoped>
.side-menu {
  background-color: #f4f4f4;
  width: 200px; /* Fixed width for sidebar */
  position: fixed;
  top: 55px; /* Below the header */

  left: 0;
  bottom: 0;
  overflow-y: auto;
  padding-top: 0;
  z-index: 1;
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
  color: #89b4e6;
}

/* Farbe für den aktuell aktiven Link (automatisch von Vue Router) */
.router-link-active {
  font-weight: bold;
  color: #5a0ce8;
}
</style>