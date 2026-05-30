
<template>
  <div
      v-if="showMessage"
      class="alert alert-success fade show"
      role="alert"
  >
    <p><strong> {{ message }}</strong></p>
  </div>
</template>
<script>
export default {
  name: "ShowMessage",
  props: {
    showMessage: {
      type: Boolean,
    },
    message:String
  },
}
</script>
<style scoped>

</style>