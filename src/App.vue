<template>

  <GlobalMessage />
  <GlobalErrorMessage />

  <router-view></router-view>


</template>

<script>
import GlobalMessage from "@/components/admin/community/GlobalMessage.vue";
import GlobalErrorMessage from "@/components/admin/community/GlobalErrorMessage.vue";

export default {
  name: 'App',
  components: {GlobalMessage, GlobalErrorMessage},
};
</script>