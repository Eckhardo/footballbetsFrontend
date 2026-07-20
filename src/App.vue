<template>

  <GlobalMessage />
  <GlobalErrorMessage />

  <!-- Vue 3 Router View with fullPath key mapping -->
  <router-view :key="$route.fullPath" />


</template>

<script>
import GlobalMessage from "@/components/admin/community/GlobalMessage.vue";
import GlobalErrorMessage from "@/components/admin/community/GlobalErrorMessage.vue";

export default {
  name: 'App',
  components: {GlobalMessage, GlobalErrorMessage},
};
</script>