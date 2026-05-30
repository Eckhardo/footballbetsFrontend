<template>

  <GlobalMessage />
  <GlobalErrorMessage />
  <router-view></router-view>

</template>

<script>
import GlobalErrorMessage from "./components/GlobalErrorMessage.vue";
import GlobalMessage from "./components/GlobalMessage.vue";

export default {
  name: 'App',
  components: {GlobalMessage, GlobalErrorMessage},
};
</script>