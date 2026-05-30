<template>
  <div class="main-layout">
    <AppHeader/>
    <CompAdminMenu/>
    <CommAdminMenu/>
    <main class="main-content">

      <div class="button-container  mt-3 mx-1">

        <div class="center-group">

          <button @click="showCompFamily" class="btn btn-warning">
            Wettbewerb
          </button>
        </div>
        <button @click="login" class="right-btn btn btn-warning ">
          Login
        </button>
      </div>

      <!-- The content of the current route (Home or Dashboard) will be rendered here -->
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import AppHeader from '../components/Header.vue';
import CompAdminMenu from '../components/CompAdminMenu.vue';
import {mapState} from "pinia";
import {useUmsInfoStore} from "@/stores/umsInfoStore.js";
import CommAdminMenu from "../components/CommAdminMenu.vue";

export default {
  name: 'MainLayout',
  components: {
    AppHeader, CompAdminMenu,CommAdminMenu,
  },

  data() {
    return {

    }
  },
  computed: {
    ...mapState(useUmsInfoStore, {username: 'username', loggedIn: 'loggedIn', compId: 'defaultCompetitionId'}),
  },
  methods: {

    showCompFamily() {
      this.$router.push({name: 'CompFamily'});

    },
    login() {
      this.$router.push({name: 'Login', params: {openDialog: true}});
    },
  },
};

</script>

<style scoped>

.main-content {
  background-color: #eeeeee;
  /* Pushes content right to make room for the sidebar */
  margin-left: 200px;
  /* Pushes content down to make room for the header */
  margin-top: 0;
  padding: 10px;
  /* Ensures content can scroll if it overflows its area */
  overflow-y: auto;
  height: calc(100vh - 60px); /* Full viewport height minus header height */
}

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

.right-btn {
  grid-column: 3;
  justify-self: end;
  margin: 10px;

  /* Aligns to the far right of the third column */
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
